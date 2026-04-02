import request from 'supertest';
import bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('GET /notes/:id', () => {
  const testEmail = 'getbyid@example.com';
  const testPassword = 'password123';
  const otherEmail = 'othergetbyid@example.com';
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
        firstName: 'Get',
        lastName: 'ById',
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
      data: { title: 'My Note', text: 'Text 1', userId: user.id },
    });
    myNoteId = myNote.id;

    const otherNote = await prisma.note.create({
      data: { title: 'Not My Note', text: 'Text 2', userId: otherUser.id },
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
    const response = await request(app).get(/notes/ + myNoteId);
    expect(response.status).toBe(401);
  });

  it('should return 404 if the note does not exist', async () => {
    const response = await request(app)
      // Using a structurally valid UUID that doesn't exist in the DB
      .get('/notes/00000000-0000-0000-0000-000000000000')
      .set('Cookie', authCookie);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });
  });

  it('should return 404 if trying to fetch a note belonging to another user', async () => {
    const response = await request(app)
      .get(/notes/ + otherNoteId)
      .set('Cookie', authCookie);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Note not found' });
  });

  it('should return 200 and the note data if the user is authorized', async () => {
    const response = await request(app)
      .get(/notes/ + myNoteId)
      .set('Cookie', authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('note');

    const note = response.body.note;
    expect(note).toHaveProperty('id', myNoteId);
    expect(note).toHaveProperty('title', 'My Note');
    expect(note).toHaveProperty('text', 'Text 1');
    expect(note).toHaveProperty('creator', testEmail);
    expect(note).toHaveProperty('updatedAt');
    expect(note).toHaveProperty('pinnedAt');
  });

  it('should return 500 if there is a database error', async () => {
    const findFirstMock = vi
      .spyOn(prisma.note, 'findFirst')
      .mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get(/notes/ + myNoteId)
      .set('Cookie', authCookie);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to fetch note' });

    findFirstMock.mockRestore();
  });
});
