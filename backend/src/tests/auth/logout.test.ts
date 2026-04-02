import request from 'supertest';
import bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('POST /auth/logout', () => {
  const testEmail = 'logoutuser@example.com';
  const testPassword = 'logoutpassword123';

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testPassword, 10);
    await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'Logout',
        lastName: 'User',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: { email: testEmail },
    });
  });

  it('should clear the session cookie and return 204 when authenticated', async () => {
    // Log in to get the cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    const cookie = loginResponse.headers['set-cookie'];

    // Perform logout
    const logoutResponse = await request(app)
      .post('/auth/logout')
      .set('Cookie', cookie);

    // Validations
    expect(logoutResponse.status).toBe(204);
    // When using 204 No Content, there is no body, so we omit testing logoutResponse.body

    // Validate that the server asks to clear the cookie (Max-Age=0 or Expires in the past)
    const setCookieHeader = logoutResponse.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/session=;/); // Usually session is cleared as empty
    expect(setCookieHeader[0]).toMatch(
      /Max-Age=0|Expires=.*1970|expires=Thu, 01 Jan 1970/
    ); // Cookie expiration
  });

  it('should return 204 even if the user is already logged out or no cookie is sent', async () => {
    const response = await request(app).post('/auth/logout');
    expect(response.status).toBe(204);
    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(
      /Max-Age=0|Expires=.*1970|expires=Thu, 01 Jan 1970/
    );
  });
});
