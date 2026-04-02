import request from 'supertest';
import bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('GET /notes', () => {
  const testEmail = 'list@example.com';
  const testPassword = 'password123';
  const otherEmail = 'otherlist@example.com';
  let authCookie: string[];

  // Seed the database with a test user before running the tests
  beforeAll(async () => {
    // Generate hash the same way the application does when creating a user
    const passwordHash = await bcrypt.hash(testPassword, 10);

    // Create or ensure the test user exists in the database
    const user = await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'User',
        lastName: 'Test',
      },
    });

    // Create another user to test isolation (make sure we don't get their notes)
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

    // Delete existing notes to ensure exact counts in test
    await prisma.note.deleteMany({
      where: { userId: { in: [user.id, otherUser.id] } },
    });

    // Create some notes: 2 for the main test user, 1 for the other user
    await prisma.note.createMany({
      data: [
        { title: 'My Note 1', text: 'Text 1', userId: user.id },
        { title: 'My Note 2', text: 'Text 2', userId: user.id },
        { title: 'Not My Note', text: 'Text 3', userId: otherUser.id },
      ],
    });

    // Log in to get the authentication cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    authCookie = loginResponse.headers['set-cookie'];
  });

  // Clean up the test user after tests are done
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [testEmail, otherEmail] } },
    });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(401);
  });

  it('should return 200 and an array of notes belonging only to the authenticated user', async () => {
    const response = await request(app).get('/notes').set('Cookie', authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('notes');
    expect(Array.isArray(response.body.notes)).toBe(true);

    // We expect exactly 2 notes because we created 2 for this user and 1 for the other user.
    // This confirms the `where: { userId: req.user!.id }` filter is working nicely.
    expect(response.body.notes).toHaveLength(2);

    // Validate the shape of the returned note objects to match the endpoint's .map()
    const firstNote = response.body.notes[0];
    expect(firstNote).toHaveProperty('id');
    expect(firstNote).toHaveProperty('title');
    expect(firstNote).toHaveProperty('text');
    expect(firstNote).toHaveProperty('creator', testEmail);
    expect(firstNote).toHaveProperty('updatedAt');
    expect(firstNote).toHaveProperty('pinnedAt');
  });

  it("should return 500 if there's an error fetching notes", async () => {
    // Mock the prisma.note.findMany method to throw an error
    const findManyMock = vi
      .spyOn(prisma.note, 'findMany')
      .mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/notes').set('Cookie', authCookie);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to fetch notes' });
    findManyMock.mockRestore();
  });
});
