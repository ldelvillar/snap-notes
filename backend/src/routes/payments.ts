import { Router } from 'express';
import Stripe from 'stripe';
import { requireAuth } from '@/middlewares/requireAuth';
import { validate } from '@/middlewares/validate';
import { paymentIntentSchema } from '@/schemas/payments';
import { env } from '@/lib/env';

export const paymentsRouter = Router();

const stripe = new Stripe(env.stripeSecretKey);

paymentsRouter.post(
  '/payment-intent',
  requireAuth,
  validate(paymentIntentSchema),
  async (req, res) => {
    const { amount } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        payment_method_types: ['card'],
      });

      return res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  }
);
