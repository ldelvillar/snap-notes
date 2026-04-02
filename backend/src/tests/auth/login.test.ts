import request from 'supertest';
import bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('POST /auth/login', () => {
  const testEmail = 'test@example.com';
  const testPassword = 'password123';

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
  });

  // Clean up the test user after tests are done
  afterAll(async () => {
    await prisma.user.delete({
      where: { email: testEmail },
    });
  });

  it('should return 200, user data without passwordHash, and set cookie on successful login', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    // Validate status and cookie
    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toMatch('snapnotes_session');

    // Validate response body (user data, no passwordHash)
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testEmail);
    expect(response.body.user).toHaveProperty('firstName', 'User');
    expect(response.body.user).toHaveProperty('lastName', 'Test');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app).post('/auth/login').send({
      email: testEmail,
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app).post('/auth/login').send({
      password: testPassword,
    });

    expect(response.status).toBe(400);
  });

  it('should return 400 when email and password are missing', async () => {
    const response = await request(app).post('/auth/login').send({});

    expect(response.status).toBe(400);
  });

  it('should return 401 on invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: 'wrongpassword' });

    expect(response.status).toBe(401);
  });

  it('should return 500 if AUTH_JWT_SECRET is missing', async () => {
    // Save original env
    const originalSecret = process.env.AUTH_JWT_SECRET;

    // Temporarily delete the secret
    delete process.env.AUTH_JWT_SECRET;

    const response = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(response.status).toBe(500);

    // Restore env for following tests
    process.env.AUTH_JWT_SECRET = originalSecret;
  });
});
