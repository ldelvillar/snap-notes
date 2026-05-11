import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { requireAuth } from '@/middlewares/requireAuth';
import { validate } from '@/middlewares/validate';
import { loginSchema, registerSchema } from '@/schemas/auth';

export const authRouter = Router();

const cookieSameSite: 'lax' | 'none' = env.isProduction ? 'none' : 'lax';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many registration attempts, please try again later',
  },
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      photo: true,
      subscription: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'Session not found' });
  }

  return res.json({ user });
});

authRouter.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          photo: true,
          subscription: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt
        .compare(password, user.passwordHash)
        .catch(() => false);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ sub: user.id }, env.jwtSecret, {
        expiresIn: '7d',
      });

      res.cookie(env.cookieName, token, {
        httpOnly: true,
        sameSite: cookieSameSite,
        secure: env.isProduction,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { passwordHash: _passwordHash, ...safeUser } = user;
      return res.json({ user: safeUser });
    } catch {
      return res.status(500).json({ message: 'Failed to login' });
    }
  }
);

authRouter.post(
  '/register',
  registerLimiter,
  validate(registerSchema),
  async (req, res) => {
    const { email: rawEmail, password, firstName, lastName, phone } = req.body;
    const email = rawEmail.trim().toLowerCase();

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          firstName: firstName.trim(),
          lastName: lastName?.trim() || null,
          phone: phone?.trim() || null,
          photo: '',
          passwordHash,
          subscription: 'free',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          photo: true,
          subscription: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const token = jwt.sign({ sub: user.id }, env.jwtSecret, {
        expiresIn: '7d',
      });

      res.cookie(env.cookieName, token, {
        httpOnly: true,
        sameSite: cookieSameSite,
        secure: env.isProduction,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({ user });
    } catch {
      return res.status(500).json({ message: 'Failed to register' });
    }
  }
);

authRouter.post('/logout', (req, res) => {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    sameSite: cookieSameSite,
    secure: env.isProduction,
    path: '/',
  });

  return res.status(204).send();
});
