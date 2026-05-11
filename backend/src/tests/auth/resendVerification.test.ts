import request from 'supertest';
import bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

const mockSendVerificationEmail = vi.hoisted(() =>
  vi.fn().mockResolvedValue(undefined)
);

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: mockSendVerificationEmail,
}));

describe('POST /auth/resend-verification', () => {
  const unverifiedEmail = 'resend-unverified@example.com';
  const verifiedEmail = 'resend-verified@example.com';

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
      where: { email: unverifiedEmail },
      update: { passwordHash, emailVerifiedAt: null },
      create: {
        email: unverifiedEmail,
        passwordHash,
        firstName: 'Resend',
        lastName: 'Unverified',
      },
    });

    await prisma.user.upsert({
      where: { email: verifiedEmail },
      update: { passwordHash, emailVerifiedAt: new Date() },
      create: {
        email: verifiedEmail,
        passwordHash,
        firstName: 'Resend',
        lastName: 'Verified',
        emailVerifiedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [unverifiedEmail, verifiedEmail] } },
    });
  });

  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/auth/resend-verification')
      .send({});
    expect(response.status).toBe(400);
  });

  it('should return 200 and send email for an unverified user', async () => {
    mockSendVerificationEmail.mockClear();

    const response = await request(app)
      .post('/auth/resend-verification')
      .send({ email: unverifiedEmail });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(mockSendVerificationEmail).toHaveBeenCalledOnce();
    expect(mockSendVerificationEmail).toHaveBeenCalledWith(
      unverifiedEmail,
      expect.any(String)
    );
  });

  it('should return 200 but not send email for an already-verified user', async () => {
    mockSendVerificationEmail.mockClear();

    const response = await request(app)
      .post('/auth/resend-verification')
      .send({ email: verifiedEmail });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  it('should return 200 but not send email for a non-existent address', async () => {
    mockSendVerificationEmail.mockClear();

    const response = await request(app)
      .post('/auth/resend-verification')
      .send({ email: 'nobody@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });
});
