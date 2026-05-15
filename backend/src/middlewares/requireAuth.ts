import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/lib/env';

interface SessionPayload {
  sub: string;
  purpose: 'session';
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.[env.cookieName] as string | undefined;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as SessionPayload;

    if (!payload?.sub || payload.purpose !== 'session') {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    req.user = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
