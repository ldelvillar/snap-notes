import request from 'supertest';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));

describe('POST /auth/register', () => {
  const testEmail = 'newuser@example.com';
  const testPassword = 'SecurePassword123!';
  const testFirstName = 'New';
  const testLastName = 'User';

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [testEmail, 'another@example.com'] } },
    });
  });

  it('should register a new user, send a verification email, and return a message', async () => {
    const response = await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: testFirstName,
      lastName: testLastName,
    });

    expect(response.status).toBe(201);
    expect(response.headers['set-cookie']).toBeUndefined();
    expect(response.body).toEqual({
      message: 'Check your email to complete registration',
    });

    const userInDb = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.emailVerifiedAt).toBeNull();
  });

  it('should return 409 if user with the same email already exists', async () => {
    await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: testFirstName,
    });

    const response = await request(app).post('/auth/register').send({
      email: testEmail,
      password: 'AnotherPassword456',
      firstName: 'Clone',
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'another@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
