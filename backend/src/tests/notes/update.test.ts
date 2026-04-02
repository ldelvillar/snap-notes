import request from 'supertest';
import bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('PATCH /notes/:id', () => {
  const testEmail = 'update@example.com';
  const testPassword = 'password123';
  const otherEmail = 'otherupdate@example.com';
  let authCookie: string[];
  let myNoteId: string;
  let otherNoteId: string;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testPassword, 10);

    const user = await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Update',
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

    const myNote = await prisma.note.create({
      data: { title: 'Old Title', text: 'Old Text', userId: user.id },
    });
    myNoteId = myNote.id;

    const otherNote = await prisma.note.create({
      data: { title: 'Not My Note', text: 'Secret Text', userId: otherUser.id },
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
    const response = await request(app)
      .patch(/notes/ + myNoteId)
      .send({ title: 'New Title' });
    expect(response.status).toBe(401);
  });

  it('should return 400 if neither title nor text are provided', async () => {
    const response = await request(app)
      .patch(/notes/ + myNoteId)
      .set('Cookie', authCookie)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Nothing to update' });
  });

  it('should return 404 if the note does not exist', async () => {
    const response = await request(app)
      // Using a structurally valid UUID that doesn't exist in the DB
      .patch('/notes/00000000-0000-0000-0000-000000000000')
      .set('Cookie', authCookie)
      .send({ title: 'New Title' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });
  });

  it('should return 404 if trying to update a note belonging to another user', async () => {
    const response = await request(app)
      .patch(/notes/ + otherNoteId)
      .set('Cookie', authCookie)
      .send({ title: 'Hacked Title' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });
  });

  it('should update only the title successfully', async () => {
    const response = await request(app)
      .patch(/notes/ + myNoteId)
      .set('Cookie', authCookie)
      .send({ title: 'New Title Only' });

    expect(response.status).toBe(200);
    expect(response.body.note.title).toBe('New Title Only');
    expect(response.body.note.text).toBe('Old Text'); // Text remains unchanged
  });

  it('should update only the text successfully', async () => {
    const response = await request(app)
      .patch(/notes/ + myNoteId)
      .set('Cookie', authCookie)
      .send({ text: 'New Text Only' });

    expect(response.status).toBe(200);
    expect(response.body.note.title).toBe('New Title Only'); // Remains what it was from previous test
    expect(response.body.note.text).toBe('New Text Only');
  });

  it('should default title to "Untitled" if an empty string is provided', async () => {
    const response = await request(app)
      .patch(/notes/ + myNoteId)
      .set('Cookie', authCookie)
      .send({ title: '   ' }); // Sending blank title

    expect(response.status).toBe(200);
    expect(response.body.note.title).toBe('Untitled');
  });

  it('should return 500 if there is a database error on update', async () => {
    const updateMock = vi
      .spyOn(prisma.note, 'update')
      .mockRejectedValue(new Error('Database update error'));

    const response = await request(app)
      .patch(/notes/ + myNoteId)
      .set('Cookie', authCookie)
      .send({ text: 'Will fail' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to update note' });

    updateMock.mockRestore();
  });
});
