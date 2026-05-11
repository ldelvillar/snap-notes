import { z } from 'zod';

export const paidPlanSchema = z.enum(['pro', 'team']);

export const paymentIntentSchema = z.object({
  amount: z
    .number({ error: 'Invalid or missing amount' })
    .int()
    .positive('Invalid or missing amount'),
  plan: paidPlanSchema,
});
