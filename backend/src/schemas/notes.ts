import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().optional(),
  text: z
    .string({ error: 'Note text is required' })
    .trim()
    .min(1, 'Note text is required'),
});

export const updateNoteSchema = z
  .object({
    title: z.string().trim().optional(),
    text: z.string().optional(),
  })
  .refine(data => data.title !== undefined || data.text !== undefined, {
    message: 'Nothing to update',
  });
