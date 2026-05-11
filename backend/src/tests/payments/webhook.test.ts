import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

const stripeClient = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_dummy'
);

const buildWebhookRequest = (event: object) => {
  const payload = JSON.stringify(event);
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const header = stripeClient.webhooks.generateTestHeaderString({
    payload,
    secret,
  });
  return { payload, header };
};

describe('POST /payments/webhook', () => {
  const testEmail = 'webhooktest@example.com';
  const testPassword = 'webhookpassword123';
  let userId: string;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Webhook',
        lastName: 'Tester',
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  it('should return 400 when stripe-signature is invalid', async () => {
    const response = await request(app)
      .post('/payments/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', 'invalid-signature')
      .send(JSON.stringify({ type: 'payment_intent.succeeded' }));

    expect(response.status).toBe(400);
  });

  it('should upgrade subscription on payment_intent.succeeded', async () => {
    const event = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          metadata: { userId, plan: 'pro' },
        },
      },
    };
    const { payload, header } = buildWebhookRequest(event);

    const response = await request(app)
      .post('/payments/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', header)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('received', true);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.subscription).toBe('pro');
  });

  it('should return 200 without updating subscription for unknown event type', async () => {
    const event = {
      type: 'payment_intent.created',
      data: {
        object: {
          metadata: { userId, plan: 'team' },
        },
      },
    };
    const { payload, header } = buildWebhookRequest(event);

    const response = await request(app)
      .post('/payments/webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', header)
      .send(payload);

    expect(response.status).toBe(200);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user?.subscription).toBe('pro');
  });
});
