import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { corsMiddleware } from '@/middlewares/cors';
import { requireAuth } from '@/middlewares/requireAuth';
import { prisma } from '@/lib/prisma';

const PORT = process.env.PORT || 3001;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/auth/me', requireAuth, async (req, res) => {
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

app.post('/auth/login', async (req, res) => {
  const cookieName = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';
  const jwtSecret = process.env.AUTH_JWT_SECRET;
  const email = String(req.body?.email || '').trim();
  const password = String(req.body?.password || '');

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Missing auth configuration' });
  }

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
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
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch {
    return res.status(500).json({ message: 'Failed to login' });
  }
});

app.post('/auth/register', async (req, res) => {
  const cookieName = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';
  const jwtSecret = process.env.AUTH_JWT_SECRET;
  const email = String(req.body?.email || '')
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || '');
  const firstName = String(req.body?.firstName || '').trim();
  const lastName = String(req.body?.lastName || '').trim();
  const phone = String(req.body?.phone || '').trim();

  if (!jwtSecret) {
    return res.status(500).json({ message: 'Missing auth configuration' });
  }

  if (!email || !password || !firstName) {
    return res
      .status(400)
      .json({ message: 'Email, password and firstName are required' });
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
        firstName,
        lastName: lastName || null,
        phone: phone || null,
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
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ user });
  } catch {
    return res.status(500).json({ message: 'Failed to register' });
  }
});

app.post('/auth/logout', (req, res) => {
  const cookieName = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';

  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});
