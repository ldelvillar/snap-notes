import request from 'supertest';
import bcrypt from 'bcrypt';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('POST /notes', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'password123';
  let authCookie: string[];

  // Seed the database with a test user before running the tests
  beforeAll(async () => {
    // Generate hash the same way the application does when creating a user
    const passwordHash = await bcrypt.hash(testPassword, 10);

    // Create or ensure the test user exists in the database
    await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'User',
        lastName: 'Test',
      },
    });

    // Log in to get the authentication cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    authCookie = loginResponse.headers['set-cookie'];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Clean up the test user after tests are done
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ text: 'Some text' });
    expect(response.status).toBe(401);
  });

  it('should create a new note with a default "Untitled" title if no title is provided', async () => {
    const response = await request(app)
      .post('/notes')
      .set('Cookie', authCookie)
      .send({ text: 'Test note without title' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('note');
    expect(response.body.note).toHaveProperty('title', 'Untitled');
    expect(response.body.note).toHaveProperty(
      'text',
      'Test note without title'
    );
    expect(response.body.note).toHaveProperty('creator', testEmail);
    expect(response.body.note).toHaveProperty('id');
    expect(response.body.note).toHaveProperty('updatedAt');
    expect(response.body.note).toHaveProperty('pinnedAt');
  });

  it('should create a new note with the custom title provided', async () => {
    const response = await request(app)
      .post('/notes')
      .set('Cookie', authCookie)
      .send({ title: 'My Custom Title', text: 'Test note with title' });

    expect(response.status).toBe(201);
    expect(response.body.note).toHaveProperty('title', 'My Custom Title');
    expect(response.body.note).toHaveProperty('text', 'Test note with title');
  });

  it('should return 400 if text parameter is missing', async () => {
    const response = await request(app)
      .post('/notes')
      .set('Cookie', authCookie)
      .send({ title: 'Test note' }); // No text

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Note text is required' });
  });

  it('should return 400 if text is empty or just whitespace', async () => {
    const response = await request(app)
      .post('/notes')
      .set('Cookie', authCookie)
      .send({ text: '   ' }); // Only whitespace

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Note text is required' });
  });

  it("should return 500 if there's an error creating the note", async () => {
    // Mock the prisma.note.create method to throw an error
    const createMock = vi
      .spyOn(prisma.note, 'create')
      .mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/notes')
      .set('Cookie', authCookie)
      .send({ text: 'Test note' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to create note' });
    createMock.mockRestore();
  });
});
