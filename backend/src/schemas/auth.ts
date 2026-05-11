import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email and password are required'),
  password: z.string().min(1, 'Email and password are required'),
});

export const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

export const resendVerificationSchema = z.object({
  email: z.email('Invalid email address'),
});
