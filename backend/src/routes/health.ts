import { Router } from 'express';
import { prisma } from '@/lib/prisma';

export const healthRouter = Router();

healthRouter.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'ok',
      service: 'snap-notes-backend',
      db: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return res.status(503).json({
      status: 'degraded',
      service: 'snap-notes-backend',
      db: 'error',
      timestamp: new Date().toISOString(),
    });
  }
});
