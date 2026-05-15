import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().max(200).optional(),
  text: z
    .string({ error: 'Note text is required' })
    .max(10000)
    .trim()
    .min(1, 'Note text is required'),
});

export const updateNoteSchema = z
  .object({
    title: z.string().max(200).trim().optional(),
    text: z.string().max(10000).trim().optional(),
  })
  .refine(data => data.title !== undefined || data.text !== undefined, {
    message: 'Nothing to update',
  });
