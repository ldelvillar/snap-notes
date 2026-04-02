import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

// Mock Stripe to avoid making real HTTP calls to the API during tests
vi.mock('stripe', () => {
  return {
    default: class {
      paymentIntents = {
        create: vi.fn().mockImplementation(async config => {
          // Simulate error when amount is 9999 for testing purposes
          if (config.amount === 9999) {
            throw new Error('Stripe API Simulated Error');
          }
          return { client_secret: 'pi_test_secret_mock' };
        }),
      };
    },
  };
});

describe('POST /payments/payment-intent', () => {
  const testEmail = 'paymenttest@example.com';
  const testPassword = 'paymentpassword123';
  let authCookie: string[];

  beforeAll(async () => {
    // Create a test user in the database
    const passwordHash = await bcrypt.hash(testPassword, 10);
    await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Payment',
        lastName: 'Tester',
      },
    });

    // Login to get the authentication cookie for subsequent requests
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    authCookie = loginResponse.headers['set-cookie'];
  });

  afterAll(async () => {
    // Clean up the database after all tests are done
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
    vi.restoreAllMocks();
  });

  it('should return 401 when not authenticated', async () => {
    const response = await request(app)
      .post('/payments/payment-intent')
      // Not setting the cookie to simulate unauthenticated request
      .send({ amount: 20 });

    expect(response.status).toBe(401);
  });

  it('should return 200 and clientSecret when payment intent is created successfully', async () => {
    const response = await request(app)
      .post('/payments/payment-intent')
      .set('Cookie', authCookie)
      .send({ amount: 2000 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('clientSecret', 'pi_test_secret_mock');
  });

  it('should return 400 when amount is missing', async () => {
    const response = await request(app)
      .post('/payments/payment-intent')
      .set('Cookie', authCookie)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid or missing amount');
  });

  it('should return 400 when amount is not a number', async () => {
    const response = await request(app)
      .post('/payments/payment-intent')
      .set('Cookie', authCookie)
      .send({ amount: 'veinte' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid or missing amount');
  });

  it('should return 400 when amount is zero or negative', async () => {
    const response = await request(app)
      .post('/payments/payment-intent')
      .set('Cookie', authCookie)
      .send({ amount: -500 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid or missing amount');
  });

  it('should return 400 when Stripe API fails', async () => {
    const response = await request(app)
      .post('/payments/payment-intent')
      .set('Cookie', authCookie)
      .send({ amount: 9999 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Stripe API Simulated Error');
  });
});
