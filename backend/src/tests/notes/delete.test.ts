import request from 'supertest';
import bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('DELETE /notes/:id', () => {
  const testEmail = 'delete@example.com';
  const testPassword = 'password123';
  const otherEmail = 'otherdelete@example.com';
  let authCookie: string[];
  let noteToDeleteId: string;
  let noteToFailId: string;
  let otherNoteId: string;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testPassword, 10);

    const user = await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Delete',
        lastName: 'User',
      },
    });

    const otherUser = await prisma.user.upsert({
      where: { email: otherEmail },
      update: { passwordHash },
      create: {
        email: otherEmail,
        passwordHash,
        firstName: 'Other',
        lastName: 'User',
      },
    });

    await prisma.note.deleteMany({
      where: { userId: { in: [user.id, otherUser.id] } },
    });

    // We create two notes for the primary user:
    // one to successfully delete, and another to try and trigger a 500
    const noteToDelete = await prisma.note.create({
      data: { title: 'To Be Deleted', text: 'Bye', userId: user.id },
    });
    noteToDeleteId = noteToDelete.id;

    const noteToFail = await prisma.note.create({
      data: { title: 'To Fail Deletion', text: 'Error', userId: user.id },
    });
    noteToFailId = noteToFail.id;

    const otherNote = await prisma.note.create({
      data: { title: 'Not My Note', text: 'Secret', userId: otherUser.id },
    });
    otherNoteId = otherNote.id;

    // Log in
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    authCookie = loginResponse.headers['set-cookie'];
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [testEmail, otherEmail] } },
    });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const response = await request(app).delete(/notes/ + noteToDeleteId);
    expect(response.status).toBe(401);
  });

  it('should return 404 if the note does not exist', async () => {
    const response = await request(app)
      // Using a structurally valid UUID that doesn't exist in the DB
      .delete('/notes/00000000-0000-0000-0000-000000000000')
      .set('Cookie', authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });
  });

  it('should return 404 if trying to delete a note belonging to another user', async () => {
    const response = await request(app)
      .delete(/notes/ + otherNoteId)
      .set('Cookie', authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });

    // Verify it wasn't actually deleted
    const stillExists = await prisma.note.findUnique({
      where: { id: otherNoteId },
    });
    expect(stillExists).not.toBeNull();
  });

  it('should return 500 if there is a database error during deletion', async () => {
    const deleteMock = vi
      .spyOn(prisma.note, 'delete')
      .mockRejectedValue(new Error('Database delete error'));

    const response = await request(app)
      .delete(/notes/ + noteToFailId)
      .set('Cookie', authCookie);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to delete note' });

    deleteMock.mockRestore();
  });

  it('should successfully delete the note and return 204', async () => {
    const response = await request(app)
      .delete(/notes/ + noteToDeleteId)
      .set('Cookie', authCookie);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({}); // 204 No Content should have empty body

    // Verify the record no longer exists in DB
    const isDeleted = await prisma.note.findUnique({
      where: { id: noteToDeleteId },
    });
    expect(isDeleted).toBeNull();
  });
});
