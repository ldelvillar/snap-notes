import request from 'supertest';
import { describe, it, expect, afterEach } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('POST /auth/register', () => {
  const testEmail = 'newuser@example.com';
  const testPassword = 'SecurePassword123!';
  const testFirstName = 'New';
  const testLastName = 'User';

  // Clean up directly after each test so the database stays pure
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [testEmail, 'another@example.com'] } },
    });
  });

  it('should register a new user successfully, set cookie, and return user data without password', async () => {
    const response = await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: testFirstName,
      lastName: testLastName,
    });

    // Validations: Status and cookie
    expect(response.status).toBe(201);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toMatch('snapnotes_session');

    // Validations: Returned data
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', testEmail);
    expect(response.body.user).toHaveProperty('firstName', testFirstName);
    expect(response.body.user).toHaveProperty('lastName', testLastName);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(response.body.user).not.toHaveProperty('password');

    // Validations: Database state
    const userInDb = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    expect(userInDb).not.toBeNull();
  });

  it('should return 409 if user with the same email already exists', async () => {
    // Create the user first
    await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: testFirstName,
    });

    // Attempt to create again with the same email
    const response = await request(app).post('/auth/register').send({
      email: testEmail,
      password: 'AnotherPassword456',
      firstName: 'Clone',
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'another@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 500 if AUTH_JWT_SECRET is missing', async () => {
    const originalSecret = process.env.AUTH_JWT_SECRET;
    delete process.env.AUTH_JWT_SECRET;

    const response = await request(app).post('/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: testFirstName,
    });

    expect(response.status).toBe(500);

    process.env.AUTH_JWT_SECRET = originalSecret;
  });
});
