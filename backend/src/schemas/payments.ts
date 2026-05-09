import { z } from 'zod';

export const paymentIntentSchema = z.object({
  amount: z
    .number({ error: 'Invalid or missing amount' })
    .int()
    .positive('Invalid or missing amount'),
});
