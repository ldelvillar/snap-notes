import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/middlewares/requireAuth';
import { validate } from '@/middlewares/validate';
import { paymentIntentSchema } from '@/schemas/payments';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

export const paymentsRouter = Router();

const stripe = new Stripe(env.stripeSecretKey);

paymentsRouter.post(
  '/payment-intent',
  requireAuth,
  validate(paymentIntentSchema),
  async (req, res) => {
    const { amount, plan } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        payment_method_types: ['card'],
        metadata: { userId: req.user!.id, plan },
      });

      return res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error(err, 'Failed to create payment intent');
      return res.status(400).json({ error: message });
    }
  }
);

paymentsRouter.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res
      .status(400)
      .json({ error: `Webhook signature verification failed: ${message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { userId, plan } = paymentIntent.metadata;

    if (userId && (plan === 'pro' || plan === 'team')) {
      try {
        await prisma.user.updateMany({
          where: { id: userId, subscription: { not: plan } },
          data: { subscription: plan },
        });
      } catch {
        return res.status(500).json({ error: 'Failed to update subscription' });
      }
    }
  }

  return res.json({ received: true });
});
