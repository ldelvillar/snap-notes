import request from 'supertest';
import bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('PATCH /auth/subscription', () => {
  const testEmail = 'subuser@example.com';
  const testPassword = 'subpassword123';

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testPassword, 10);
    await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash, subscription: 'free' },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Sub',
        lastName: 'User',
        subscription: 'free',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
  });

  it('should return 200 and updated subscription when authenticated with a valid plan', async () => {
    // Log in to get the cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    const cookie = loginResponse.headers['set-cookie'];

    // Update subscription
    const response = await request(app)
      .patch('/auth/subscription')
      .set('Cookie', cookie)
      .send({ plan: 'pro' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('subscription', 'pro');

    // Verify it was saved in the DB
    const updatedUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    expect(updatedUser?.subscription).toBe('pro');
  });

  it('should return 400 when authenticated with an invalid plan', async () => {
    // Log in to get the cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    const cookie = loginResponse.headers['set-cookie'];

    // Try to update subscription with invalid plan
    const response = await request(app)
      .patch('/auth/subscription')
      .set('Cookie', cookie)
      .send({ plan: 'hacker_plan' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid subscription plan');
  });

  it('should return 401 when not authenticated', async () => {
    const response = await request(app)
      .patch('/auth/subscription')
      .send({ plan: 'pro' });
    expect(response.status).toBe(401);
  });

  it('should return 401 when authenticated with an invalid cookie', async () => {
    const response = await request(app)
      .patch('/auth/subscription')
      .set('Cookie', ['session=invalid_fake_token; HttpOnly'])
      .send({ plan: 'pro' });

    expect(response.status).toBe(401);
  });
});
