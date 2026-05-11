import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));

const JWT_SECRET = process.env.AUTH_JWT_SECRET!;

const makeVerifyToken = (userId: string, overrides: object = {}) =>
  jwt.sign({ sub: userId, purpose: 'email-verify', ...overrides }, JWT_SECRET, {
    expiresIn: '24h',
  });

describe('POST /auth/verify-email', () => {
  const testEmail = 'verifyemail@example.com';
  let userId: string;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash, emailVerifiedAt: null },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Verify',
        lastName: 'Email',
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  it('should return 400 when token is missing', async () => {
    const response = await request(app).post('/auth/verify-email').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Token is required');
  });

  it('should return 400 when token is invalid', async () => {
    const response = await request(app)
      .post('/auth/verify-email')
      .send({ token: 'not.a.valid.jwt' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  it('should return 400 when token has wrong purpose', async () => {
    const wrongToken = jwt.sign({ sub: userId }, JWT_SECRET, {
      expiresIn: '24h',
    });
    const response = await request(app)
      .post('/auth/verify-email')
      .send({ token: wrongToken });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid token');
  });

  it('should return 400 when token is expired', async () => {
    const expiredToken = jwt.sign(
      { sub: userId, purpose: 'email-verify' },
      JWT_SECRET,
      { expiresIn: -1 }
    );
    const response = await request(app)
      .post('/auth/verify-email')
      .send({ token: expiredToken });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  it('should verify email, set session cookie, and return user', async () => {
    const token = makeVerifyToken(userId);
    const response = await request(app)
      .post('/auth/verify-email')
      .send({ token });

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toMatch('snapnotes_session');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testEmail);
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(response.body.user).not.toHaveProperty('emailVerifiedAt');

    const userInDb = await prisma.user.findUnique({ where: { id: userId } });
    expect(userInDb?.emailVerifiedAt).not.toBeNull();
  });

  it('should return 400 when email is already verified', async () => {
    const token = makeVerifyToken(userId);
    const response = await request(app)
      .post('/auth/verify-email')
      .send({ token });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email already verified');
  });
});
