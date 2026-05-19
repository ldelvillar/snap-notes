import { Router } from 'express';

import { Prisma } from '../../generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/middlewares/requireAuth';
import { validate } from '@/middlewares/validate';
import { createNoteSchema, updateNoteSchema } from '@/schemas/notes';
import { logger } from '@/lib/logger';

export const notesRouter = Router();

notesRouter.use(requireAuth);

const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

notesRouter.get('/', async (req, res) => {
  const rawCursor = req.query.cursor;
  const rawLimit = req.query.limit;

  let cursor: string | undefined;
  if (rawCursor !== undefined) {
    if (typeof rawCursor !== 'string' || !UUID_RE.test(rawCursor)) {
      return res.status(400).json({ message: 'Invalid cursor' });
    }
    cursor = rawCursor;
  }

  let limit = DEFAULT_PAGE_LIMIT;
  if (rawLimit !== undefined) {
    const parsed = Number(rawLimit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_PAGE_LIMIT) {
      return res.status(400).json({
        message: `limit must be an integer between 1 and ${MAX_PAGE_LIMIT}`,
      });
    }
    limit = parsed;
  }

  try {
    let cursorSort: { pinnedAt: Date | null; updatedAt: Date } | null = null;
    if (cursor) {
      cursorSort = await prisma.note.findFirst({
        where: { id: cursor, userId: req.user!.id },
        select: { pinnedAt: true, updatedAt: true },
      });
      if (!cursorSort) {
        return res.status(400).json({ message: 'Invalid cursor' });
      }
    }

    const cursorClause =
      cursorSort === null
        ? Prisma.empty
        : cursorSort.pinnedAt === null
          ? Prisma.sql`AND n."pinnedAt" IS NULL AND (
              n."updatedAt" < ${cursorSort.updatedAt}
              OR (n."updatedAt" = ${cursorSort.updatedAt} AND n.id > ${cursor}::uuid)
            )`
          : Prisma.sql`AND (
              (n."pinnedAt" IS NOT NULL AND (
                n."pinnedAt" < ${cursorSort.pinnedAt}
                OR (n."pinnedAt" = ${cursorSort.pinnedAt} AND n."updatedAt" < ${cursorSort.updatedAt})
                OR (n."pinnedAt" = ${cursorSort.pinnedAt} AND n."updatedAt" = ${cursorSort.updatedAt} AND n.id > ${cursor}::uuid)
              ))
              OR n."pinnedAt" IS NULL
            )`;

    // All rows belong to req.user, so creator email is constant for this page.
    // We fold the email lookup into the counts query as a subquery so this
    // costs the same single round-trip whether or not we display totals.
    const [rows, meta] = await Promise.all([
      prisma.$queryRaw<
        Array<{
          id: string;
          title: string;
          textPreview: string;
          updatedAt: Date;
          pinnedAt: Date | null;
        }>
      >`
        SELECT
          n.id::text AS id,
          n.title,
          LEFT(n.text, 150) AS "textPreview",
          n."updatedAt",
          n."pinnedAt"
        FROM "Note" n
        WHERE n."userId" = ${req.user!.id}::uuid
        ${cursorClause}
        ORDER BY n."pinnedAt" DESC NULLS LAST, n."updatedAt" DESC, n.id ASC
        LIMIT ${limit + 1}
      `,
      prisma.$queryRaw<
        Array<{ creator: string | null; total: bigint; pinnedTotal: bigint }>
      >`
        SELECT
          (SELECT email FROM "User" WHERE id = ${req.user!.id}::uuid) AS creator,
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE "pinnedAt" IS NOT NULL) AS "pinnedTotal"
        FROM "Note"
        WHERE "userId" = ${req.user!.id}::uuid
      `,
    ]);

    const creator = meta[0].creator ?? '';
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? page[page.length - 1].id : null;

    return res.json({
      notes: page.map(n => ({ ...n, creator })),
      nextCursor,
      total: Number(meta[0].total),
      pinnedTotal: Number(meta[0].pinnedTotal),
    });
  } catch (err) {
    logger.error(err, 'Failed to fetch notes');
    return res.status(500).json({ message: 'Failed to fetch notes' });
  }
});

notesRouter.get('/:id', async (req, res) => {
  const noteId = String(req.params.id || '').trim();

  if (!noteId) {
    return res.status(400).json({ message: 'Note id is required' });
  }

  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.json({
      note: {
        id: note.id,
        title: note.title,
        text: note.text,
        creator: note.user.email,
        updatedAt: note.updatedAt,
        pinnedAt: note.pinnedAt,
      },
    });
  } catch (err) {
    logger.error(err, 'Failed to fetch note');
    return res.status(500).json({ message: 'Failed to fetch note' });
  }
});

notesRouter.post('/', validate(createNoteSchema), async (req, res) => {
  const { title = '', text } = req.body;

  try {
    const note = await prisma.note.create({
      data: {
        title: title || 'Untitled',
        text,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      note: {
        id: note.id,
        title: note.title,
        text: note.text,
        creator: note.user.email,
        updatedAt: note.updatedAt,
        pinnedAt: note.pinnedAt,
      },
    });
  } catch (err) {
    logger.error(err, 'Failed to create note');
    return res.status(500).json({ message: 'Failed to create note' });
  }
});

notesRouter.patch('/:id', validate(updateNoteSchema), async (req, res) => {
  const noteId = String(req.params.id || '').trim();
  const { title, text } = req.body;

  if (!noteId) {
    return res.status(400).json({ message: 'Note id is required' });
  }

  try {
    const existing = await prisma.note.findFirst({
      where: { id: noteId, userId: req.user!.id },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title !== undefined ? { title: title || 'Untitled' } : {}),
        ...(text !== undefined ? { text } : {}),
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return res.json({
      note: {
        id: note.id,
        title: note.title,
        text: note.text,
        creator: note.user.email,
        updatedAt: note.updatedAt,
        pinnedAt: note.pinnedAt,
      },
    });
  } catch (err) {
    logger.error(err, 'Failed to update note');
    return res.status(500).json({ message: 'Failed to update note' });
  }
});

notesRouter.patch('/:id/pin', async (req, res) => {
  const noteId = String(req.params.id || '').trim();

  if (!noteId) {
    return res.status(400).json({ message: 'Note id is required' });
  }

  try {
    const existing = await prisma.note.findFirst({
      where: { id: noteId, userId: req.user!.id },
      select: { id: true, pinnedAt: true },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        pinnedAt: existing.pinnedAt ? null : new Date(),
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return res.json({
      note: {
        id: note.id,
        title: note.title,
        text: note.text,
        creator: note.user.email,
        updatedAt: note.updatedAt,
        pinnedAt: note.pinnedAt,
      },
    });
  } catch (err) {
    logger.error(err, 'Failed to pin note');
    return res.status(500).json({ message: 'Failed to pin note' });
  }
});

notesRouter.delete('/:id', async (req, res) => {
  const noteId = String(req.params.id || '').trim();

  if (!noteId) {
    return res.status(400).json({ message: 'Note id is required' });
  }

  try {
    const { count } = await prisma.note.deleteMany({
      where: { id: noteId, userId: req.user!.id },
    });

    if (count === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    return res.status(204).send();
  } catch (err) {
    logger.error(err, 'Failed to delete note');
    return res.status(500).json({ message: 'Failed to delete note' });
  }
});
