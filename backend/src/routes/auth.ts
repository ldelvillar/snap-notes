import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/middlewares/requireAuth';
import { validate } from '@/middlewares/validate';
import {
  loginSchema,
  registerSchema,
  subscriptionSchema,
} from '@/schemas/auth';

export const authRouter = Router();

const isProduction = process.env.NODE_ENV === 'production';
const cookieSameSite: 'lax' | 'none' = isProduction ? 'none' : 'lax';

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

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const cookieName = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';
  const jwtSecret = process.env.AUTH_JWT_SECRET;
  const { email, password } = req.body;

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Missing auth configuration' });
  }

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

    let isPasswordValid = false;

    try {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    } catch {
      isPasswordValid = false;
    }

    if (!isPasswordValid && user.passwordHash === password) {
      isPasswordValid = true;
      const newPasswordHash = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '7d' });

    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: cookieSameSite,
      secure: isProduction,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch {
    return res.status(500).json({ message: 'Failed to login' });
  }
});

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const cookieName = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';
  const jwtSecret = process.env.AUTH_JWT_SECRET;
  const { email: rawEmail, password, firstName, lastName, phone } = req.body;
  const email = rawEmail.trim().toLowerCase();

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Missing auth configuration' });
  }

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

    const token = jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '7d' });

    res.cookie(cookieName, token, {
      httpOnly: true,
      sameSite: cookieSameSite,
      secure: isProduction,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ user });
  } catch {
    return res.status(500).json({ message: 'Failed to register' });
  }
});

authRouter.post('/logout', (req, res) => {
  const cookieName = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';

  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: cookieSameSite,
    secure: isProduction,
    path: '/',
  });

  return res.status(204).send();
});

authRouter.patch(
  '/subscription',
  requireAuth,
  validate(subscriptionSchema),
  async (req, res) => {
    const { plan } = req.body;

    try {
      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: { subscription: plan },
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

      return res.json({ user });
    } catch {
      return res.status(500).json({ message: 'Failed to update subscription' });
    }
  }
);
