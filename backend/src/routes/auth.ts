import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { sendVerificationEmail } from '@/lib/email';
import { requireAuth } from '@/middlewares/requireAuth';
import { validate } from '@/middlewares/validate';
import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
} from '@/schemas/auth';
import { generateCsrfToken } from '@/lib/csrf';

export const authRouter = Router();

authRouter.get('/csrf-token', (req, res) => {
  const csrfToken = generateCsrfToken(req, res);
  return res.json({ csrfToken });
});

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

const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many resend attempts, please try again later' },
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
          emailVerifiedAt: true,
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

      if (!user.emailVerifiedAt) {
        return res
          .status(403)
          .json({ message: 'Please verify your email before logging in' });
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

      const {
        passwordHash: _passwordHash,
        emailVerifiedAt: _emailVerifiedAt,
        ...safeUser
      } = user;
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
        select: { id: true, email: true },
      });

      const verifyToken = jwt.sign(
        { sub: user.id, purpose: 'email-verify' },
        env.jwtSecret,
        { expiresIn: '24h' }
      );

      await sendVerificationEmail(user.email, verifyToken);

      return res
        .status(201)
        .json({ message: 'Check your email to complete registration' });
    } catch {
      return res.status(500).json({ message: 'Failed to register' });
    }
  }
);

authRouter.post('/verify-email', async (req, res) => {
  const { token } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Token is required' });
  }

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload;
  } catch {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  if (payload.purpose !== 'email-verify' || typeof payload.sub !== 'string') {
    return res.status(400).json({ message: 'Invalid token' });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      photo: true,
      subscription: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (user.emailVerifiedAt) {
    return res.status(400).json({ message: 'Email already verified' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });

  const sessionToken = jwt.sign({ sub: user.id }, env.jwtSecret, {
    expiresIn: '7d',
  });

  res.cookie(env.cookieName, sessionToken, {
    httpOnly: true,
    sameSite: cookieSameSite,
    secure: env.isProduction,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { emailVerifiedAt: _emailVerifiedAt, ...safeUser } = user;
  return res.json({ user: safeUser });
});

authRouter.post(
  '/resend-verification',
  resendLimiter,
  validate(resendVerificationSchema),
  async (req, res) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, email: true, emailVerifiedAt: true },
    });

    // Same message whether email exists or not — prevents enumeration
    const successMessage = {
      message:
        'If that email is registered and unverified, a new link has been sent',
    };

    if (!user || user.emailVerifiedAt) {
      return res.json(successMessage);
    }

    const verifyToken = jwt.sign(
      { sub: user.id, purpose: 'email-verify' },
      env.jwtSecret,
      { expiresIn: '24h' }
    );

    try {
      await sendVerificationEmail(user.email, verifyToken);
    } catch {
      return res
        .status(500)
        .json({ message: 'Failed to send verification email' });
    }

    return res.json(successMessage);
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
