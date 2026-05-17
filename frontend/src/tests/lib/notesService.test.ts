import { describe, it, expect } from 'vitest';
import { noteToListItem } from '@/lib/notesService';
import { Note } from '@/types';

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
