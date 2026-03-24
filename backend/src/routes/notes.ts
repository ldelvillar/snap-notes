import { Router } from 'express';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/middlewares/requireAuth';

export const notesRouter = Router();

notesRouter.use(requireAuth);

notesRouter.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ updatedAt: 'desc' }],
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return res.json({
      notes: notes.map(note => ({
        id: note.id,
        title: note.title,
        text: note.text,
        creator: note.user.email,
        updatedAt: note.updatedAt,
        pinnedAt: note.pinnedAt,
      })),
    });
  } catch {
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
  } catch {
    return res.status(500).json({ message: 'Failed to fetch note' });
  }
});

notesRouter.post('/', async (req, res) => {
  const title = String(req.body?.title || '').trim();
  const text = String(req.body?.text || '');

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
  } catch {
    return res.status(500).json({ message: 'Failed to create note' });
  }
});

notesRouter.patch('/:id', async (req, res) => {
  const noteId = String(req.params.id || '').trim();
  const title =
    typeof req.body?.title === 'string' ? req.body.title.trim() : undefined;
  const text = typeof req.body?.text === 'string' ? req.body.text : undefined;

  if (!noteId) {
    return res.status(400).json({ message: 'Note id is required' });
  }

  if (title === undefined && text === undefined) {
    return res.status(400).json({ message: 'Nothing to update' });
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
  } catch {
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
  } catch {
    return res.status(500).json({ message: 'Failed to pin note' });
  }
});

notesRouter.delete('/:id', async (req, res) => {
  const noteId = String(req.params.id || '').trim();

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

    await prisma.note.delete({
      where: { id: noteId },
    });

    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: 'Failed to delete note' });
  }
});
