import request from 'supertest';
import bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('GET /auth/me', () => {
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

  it('should return 200 and user data when authenticated', async () => {
    // First, log in to get the authentication cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    const cookies = loginResponse.headers['set-cookie'];

    // Now actually call /auth/me with the acquired cookie
    const response = await request(app).get('/auth/me').set('Cookie', cookies);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testEmail);
    expect(response.body.user).toHaveProperty('firstName', 'User');
    expect(response.body.user).not.toHaveProperty('passwordHash');
  });

  it('should return 401 when not authenticated', async () => {
    const response = await request(app).get('/auth/me');
    expect(response.status).toBe(401);
  });

  it('should return 401 when authenticated with an invalid or tampered cookie', async () => {
    const response = await request(app)
      .get('/auth/me')
      .set('Cookie', ['session=invalid_or_fake_jwt_token_here; HttpOnly']);

    expect(response.status).toBe(401);
  });
});
