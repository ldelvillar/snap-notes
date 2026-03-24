import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe('GET /health', () => {
  it('returns 200 when database is reachable', async () => {
    (prisma.$queryRaw as any).mockResolvedValueOnce(1);

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'snap-notes-backend',
      db: 'ok',
      timestamp: expect.any(String),
    });
  });

  it('returns 503 when database is not reachable', async () => {
    (prisma.$queryRaw as any).mockRejectedValueOnce(new Error('db error'));

    const response = await request(app).get('/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: 'degraded',
      service: 'snap-notes-backend',
      db: 'error',
      timestamp: expect.any(String),
    });
  });
});
