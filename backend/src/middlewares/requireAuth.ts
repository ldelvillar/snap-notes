import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface SessionPayload {
  sub: string;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const cookieName = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';
  const token = req.cookies?.[cookieName] as string | undefined;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const jwtSecret = process.env.AUTH_JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ message: 'Missing auth configuration' });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as SessionPayload;

    if (!payload?.sub) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    req.user = { id: payload.sub };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
