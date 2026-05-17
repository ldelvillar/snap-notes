import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getNotes, noteToListItem } from '@/lib/notesService';
import { Note, User } from '@/types';

const BASE_NOTE: Note = {
  id: 'note-1',
  title: 'Test note',
  text: 'Hello world',
  creator: 'user@example.com',
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  pinnedAt: null,
};

describe('noteToListItem', () => {
  it('converts text to textPreview', () => {
    const item = noteToListItem(BASE_NOTE);
    expect(item.textPreview).toBe('Hello world');
    expect(item).not.toHaveProperty('text');
  });

  it('truncates textPreview to 150 characters', () => {
    const longText = 'a'.repeat(200);
    const item = noteToListItem({ ...BASE_NOTE, text: longText });
    expect(item.textPreview).toHaveLength(150);
  });

  it('preserves all other fields unchanged', () => {
    const item = noteToListItem(BASE_NOTE);
    expect(item.id).toBe(BASE_NOTE.id);
    expect(item.title).toBe(BASE_NOTE.title);
    expect(item.creator).toBe(BASE_NOTE.creator);
    expect(item.updatedAt).toBe(BASE_NOTE.updatedAt);
    expect(item.pinnedAt).toBeNull();
  });

  it('preserves pinnedAt when set', () => {
    const pinnedAt = new Date('2024-06-01T00:00:00Z');
    const item = noteToListItem({ ...BASE_NOTE, pinnedAt });
    expect(item.pinnedAt).toBe(pinnedAt);
  });
});

const USER: User = {
  id: 'user-1',
  email: 'user@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: null,
  photo: null,
  subscription: 'free',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

function mockNotesResponse(notes: unknown[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ notes }),
    }),
  );
}

describe('getNotes', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses updatedAt strings into Date objects', async () => {
    mockNotesResponse([
      {
        id: '1',
        title: 't',
        textPreview: 'p',
        creator: 'c',
        updatedAt: '2024-01-01T00:00:00Z',
        pinnedAt: null,
      },
    ]);

    const notes = await getNotes(USER);

    expect(notes[0].updatedAt).toBeInstanceOf(Date);
    expect(notes[0].updatedAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('sets pinnedAt to null when the DTO has null', async () => {
    mockNotesResponse([
      {
        id: '1',
        title: 't',
        textPreview: 'p',
        creator: 'c',
        updatedAt: '2024-01-01T00:00:00Z',
        pinnedAt: null,
      },
    ]);

    const notes = await getNotes(USER);

    expect(notes[0].pinnedAt).toBeNull();
  });

  it('parses pinnedAt strings into Date objects when present', async () => {
    mockNotesResponse([
      {
        id: '1',
        title: 't',
        textPreview: 'p',
        creator: 'c',
        updatedAt: '2024-01-01T00:00:00Z',
        pinnedAt: '2024-06-01T00:00:00Z',
      },
    ]);

    const notes = await getNotes(USER);

    expect(notes[0].pinnedAt).toBeInstanceOf(Date);
    expect(notes[0].pinnedAt?.toISOString()).toBe('2024-06-01T00:00:00.000Z');
  });

  it('throws when user is not defined', async () => {
    await expect(getNotes(null as unknown as User)).rejects.toThrow('User is not defined');
  });
});
