import request from 'supertest';
import bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '@/app';
import { prisma } from '@/lib/prisma';

describe('GET /notes', () => {
  const testEmail = 'list@example.com';
  const testPassword = 'password123';
  const otherEmail = 'otherlist@example.com';
  let authCookie: string[];

  // Seed the database with a test user before running the tests
  beforeAll(async () => {
    // Generate hash the same way the application does when creating a user
    const passwordHash = await bcrypt.hash(testPassword, 10);

    // Create or ensure the test user exists in the database
    const user = await prisma.user.upsert({
      where: { email: testEmail },
      update: { passwordHash, emailVerifiedAt: new Date() },
      create: {
        email: testEmail,
        passwordHash,
        firstName: 'User',
        lastName: 'Test',
        emailVerifiedAt: new Date(),
      },
    });

    // Create another user to test isolation (make sure we don't get their notes)
    const otherUser = await prisma.user.upsert({
      where: { email: otherEmail },
      update: { passwordHash, emailVerifiedAt: new Date() },
      create: {
        email: otherEmail,
        passwordHash,
        firstName: 'Other',
        lastName: 'User',
        emailVerifiedAt: new Date(),
      },
    });

    // Delete existing notes to ensure exact counts in test
    await prisma.note.deleteMany({
      where: { userId: { in: [user.id, otherUser.id] } },
    });

    // Create some notes: 2 for the main test user, 1 for the other user
    await prisma.note.createMany({
      data: [
        { title: 'My Note 1', text: 'Text 1', userId: user.id },
        { title: 'My Note 2', text: 'Text 2', userId: user.id },
        { title: 'Not My Note', text: 'Text 3', userId: otherUser.id },
      ],
    });

    // Extra notes for pagination tests, prefixed so we can identify them
    const paginationNotes = Array.from({ length: 10 }, (_, i) => ({
      title: `Pagination ${i.toString().padStart(2, '0')}`,
      text: `Pagination text ${i}`,
      userId: user.id,
    }));
    for (const note of paginationNotes) {
      await prisma.note.create({ data: note });
    }

    // Log in to get the authentication cookie
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    authCookie = loginResponse.headers['set-cookie'];
  });

  // Clean up the test user after tests are done
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [testEmail, otherEmail] } },
    });
  });

  it('should return 401 if the user is not authenticated', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(401);
  });

  it('should return 200 and notes belonging only to the authenticated user, with a nextCursor', async () => {
    const response = await request(app).get('/notes').set('Cookie', authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('notes');
    expect(Array.isArray(response.body.notes)).toBe(true);
    expect(response.body).toHaveProperty('nextCursor');

    // 12 notes for this user (2 base + 10 pagination), 1 for the other.
    // Default limit is 50, so we expect all 12 in one page and nextCursor=null.
    expect(response.body.notes).toHaveLength(12);
    expect(response.body.nextCursor).toBeNull();
    expect(response.body.total).toBe(12);
    expect(response.body.pinnedTotal).toBe(0);

    const firstNote = response.body.notes[0];
    expect(firstNote).toHaveProperty('id');
    expect(firstNote).toHaveProperty('title');
    expect(firstNote).toHaveProperty('textPreview');
    expect(firstNote).toHaveProperty('creator', testEmail);
    expect(firstNote).toHaveProperty('updatedAt');
    expect(firstNote).toHaveProperty('pinnedAt');

    // Confirm no notes from the other user leaked into this user's response
    for (const note of response.body.notes) {
      expect(note.creator).toBe(testEmail);
    }
  });

  it('should respect the limit query param and return a nextCursor when more remain', async () => {
    const response = await request(app)
      .get('/notes?limit=5')
      .set('Cookie', authCookie);

    expect(response.status).toBe(200);
    expect(response.body.notes).toHaveLength(5);
    expect(response.body.nextCursor).toEqual(expect.any(String));
    expect(response.body.nextCursor).toBe(response.body.notes[4].id);
    // total reflects the full row count regardless of page size
    expect(response.body.total).toBe(12);
  });

  it('should return the next page when called with the previous nextCursor', async () => {
    const firstPage = await request(app)
      .get('/notes?limit=5')
      .set('Cookie', authCookie);

    expect(firstPage.status).toBe(200);
    const cursor = firstPage.body.nextCursor as string;
    expect(cursor).toBeTruthy();

    const secondPage = await request(app)
      .get(`/notes?limit=5&cursor=${cursor}`)
      .set('Cookie', authCookie);

    expect(secondPage.status).toBe(200);
    expect(secondPage.body.notes).toHaveLength(5);

    const firstPageIds = new Set(
      firstPage.body.notes.map((n: { id: string }) => n.id)
    );
    for (const note of secondPage.body.notes) {
      expect(firstPageIds.has(note.id)).toBe(false);
    }
  });

  it('should return a null nextCursor on the final page', async () => {
    // 12 total notes; limit=5 means pages of 5, 5, 2.
    const firstPage = await request(app)
      .get('/notes?limit=5')
      .set('Cookie', authCookie);
    const secondPage = await request(app)
      .get(`/notes?limit=5&cursor=${firstPage.body.nextCursor}`)
      .set('Cookie', authCookie);
    const thirdPage = await request(app)
      .get(`/notes?limit=5&cursor=${secondPage.body.nextCursor}`)
      .set('Cookie', authCookie);

    expect(thirdPage.status).toBe(200);
    expect(thirdPage.body.notes).toHaveLength(2);
    expect(thirdPage.body.nextCursor).toBeNull();
  });

  it('truncates note text to a 150-char textPreview on the server', async () => {
    const longUser = await prisma.user.findUnique({
      where: { email: testEmail },
      select: { id: true },
    });
    const note = await prisma.note.create({
      data: {
        title: 'Long',
        text: 'x'.repeat(500),
        userId: longUser!.id,
      },
    });

    const response = await request(app)
      .get(`/notes?limit=100`)
      .set('Cookie', authCookie);

    const found = response.body.notes.find(
      (n: { id: string }) => n.id === note.id
    );
    expect(found).toBeDefined();
    expect(found.textPreview).toHaveLength(150);
    expect(found.textPreview).toBe('x'.repeat(150));

    await prisma.note.delete({ where: { id: note.id } });
  });

  it('paginates correctly across the pinned/unpinned boundary', async () => {
    const u = await prisma.user.findUnique({
      where: { email: testEmail },
      select: { id: true },
    });

    // Pin two of the existing notes so the list straddles the boundary.
    const toPin = await prisma.note.findMany({
      where: { userId: u!.id },
      take: 2,
      orderBy: { createdAt: 'asc' },
    });
    for (const n of toPin) {
      await prisma.note.update({
        where: { id: n.id },
        data: { pinnedAt: new Date() },
      });
    }

    // Walk the list one note at a time. Every note should appear exactly once,
    // and all pinned notes should come before any unpinned note.
    const seen: Array<{ id: string; pinnedAt: string | null }> = [];
    let cursor: string | null = null;
    for (let i = 0; i < 20; i++) {
      const res: import('supertest').Response = await request(app)
        .get(`/notes?limit=1${cursor ? `&cursor=${cursor}` : ''}`)
        .set('Cookie', authCookie);
      expect(res.status).toBe(200);
      if (res.body.notes.length === 0) break;
      seen.push(res.body.notes[0]);
      cursor = res.body.nextCursor;
      if (!cursor) break;
    }

    const ids = seen.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);

    const lastPinnedIdx = seen.map(n => (n.pinnedAt ? 1 : 0)).lastIndexOf(1);
    const firstUnpinnedIdx = seen.findIndex(n => !n.pinnedAt);
    if (lastPinnedIdx !== -1 && firstUnpinnedIdx !== -1) {
      expect(lastPinnedIdx).toBeLessThan(firstUnpinnedIdx);
    }

    // Cleanup: unpin
    for (const n of toPin) {
      await prisma.note.update({
        where: { id: n.id },
        data: { pinnedAt: null },
      });
    }
  });

  it('should return 400 for an invalid cursor', async () => {
    const response = await request(app)
      .get('/notes?cursor=not-a-uuid')
      .set('Cookie', authCookie);

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/cursor/i);
  });

  it('should return 400 for an out-of-range limit', async () => {
    const tooBig = await request(app)
      .get('/notes?limit=500')
      .set('Cookie', authCookie);
    expect(tooBig.status).toBe(400);

    const tooSmall = await request(app)
      .get('/notes?limit=0')
      .set('Cookie', authCookie);
    expect(tooSmall.status).toBe(400);

    const notANumber = await request(app)
      .get('/notes?limit=abc')
      .set('Cookie', authCookie);
    expect(notANumber.status).toBe(400);
  });
});
