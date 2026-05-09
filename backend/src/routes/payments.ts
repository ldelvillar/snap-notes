import { Router } from 'express';
import Stripe from 'stripe';
import { requireAuth } from '@/middlewares/requireAuth';
import { validate } from '@/middlewares/validate';
import { paymentIntentSchema } from '@/schemas/payments';

export const paymentsRouter = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

paymentsRouter.post(
  '/payment-intent',
  requireAuth,
  validate(paymentIntentSchema),
  async (req, res) => {
    const { amount } = req.body;

    if (!stripe) {
      return res
        .status(500)
        .json({ error: 'Missing STRIPE_SECRET_KEY configuration' });
    }

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
