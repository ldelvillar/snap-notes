import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '@/app';

describe('GET /health', () => {
  it('returns 200 when database is reachable', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'snap-notes-backend',
      db: 'ok',
      timestamp: expect.any(String),
    });
  });
});
