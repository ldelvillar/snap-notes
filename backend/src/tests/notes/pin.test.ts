import request from 'supertest';
import bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('PATCH /notes/:id/pin', () => {
  const testEmail = 'pin@example.com';
  const testPassword = 'password123';
  const otherEmail = 'otherpin@example.com';
  let authCookie: string[];
  let noteToPinId: string;
  let noteToUnpinId: string;
  let otherNoteId: string;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testPassword, 10);

    const user = await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Pin',
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

    // Create a regular unpinned note
    const noteToPin = await prisma.note.create({
      data: { title: 'Unpinned Note', text: 'Text', userId: user.id },
    });
    noteToPinId = noteToPin.id;

    // Create an already pinned note
    const noteToUnpin = await prisma.note.create({
      data: {
        title: 'Pinned Note',
        text: 'Text',
        userId: user.id,
        pinnedAt: new Date(),
      },
    });
    noteToUnpinId = noteToUnpin.id;

    // Create a note for the other user
    const otherNote = await prisma.note.create({
      data: { title: 'Not My Note', text: 'Secret', userId: otherUser.id },
    });
    otherNoteId = otherNote.id;

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
    const response = await request(app).patch(`/notes/` + noteToPinId + `/pin`);
    expect(response.status).toBe(401);
  });

  it('should return 404 if the note does not exist', async () => {
    const response = await request(app)
      .patch('/notes/00000000-0000-0000-0000-000000000000/pin')
      .set('Cookie', authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });
  });

  it('should return 404 if trying to pin a note belonging to another user', async () => {
    const response = await request(app)
      .patch(`/notes/` + otherNoteId + `/pin`)
      .set('Cookie', authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });
  });

  it('should pin an unpinned note successfully', async () => {
    const response = await request(app)
      .patch(`/notes/` + noteToPinId + `/pin`)
      .set('Cookie', authCookie);

    expect(response.status).toBe(200);
    expect(response.body.note).toHaveProperty('pinnedAt');
    expect(response.body.note.pinnedAt).not.toBeNull();
  });

  it('should unpin a pinned note successfully', async () => {
    const response = await request(app)
      .patch(`/notes/` + noteToUnpinId + `/pin`)
      .set('Cookie', authCookie);

    expect(response.status).toBe(200);
    expect(response.body.note).toHaveProperty('pinnedAt');
    expect(response.body.note.pinnedAt).toBeNull();
  });

  it('should return 500 if there is a database error', async () => {
    const updateMock = vi
      .spyOn(prisma.note, 'update')
      .mockRejectedValue(new Error('Database update error'));

    const response = await request(app)
      .patch(`/notes/` + noteToPinId + `/pin`)
      .set('Cookie', authCookie);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to pin note' });

    updateMock.mockRestore();
  });
});
