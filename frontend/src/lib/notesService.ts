import type { MouseEvent, Dispatch, SetStateAction } from 'react';
import { User, Note } from '@/types/index';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface NoteDto {
  id: string;
  title: string;
  text: string;
  creator: string;
  updatedAt: string;
  pinnedAt: string | null;
}

const mapNote = (note: NoteDto): Note => ({
  id: note.id,
  title: note.title,
  text: note.text,
  creator: note.creator,
  updatedAt: new Date(note.updatedAt),
  pinnedAt: note.pinnedAt ? new Date(note.pinnedAt) : null,
});

const sortNotes = (notes: Note[]): Note[] => {
  const pinnedNotes = notes.filter(note => note.pinnedAt !== null);
  const unpinnedNotes = notes.filter(note => note.pinnedAt === null);

  pinnedNotes.sort((a, b) => {
    const dateA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
    const dateB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
    return dateB - dateA;
  });

  return [...pinnedNotes, ...unpinnedNotes];
};

export const createNote = async (
  user: User,
  title: string,
  text: string
): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ title, text }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to create note');
    }
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const getNotes = async (user: User): Promise<Note[]> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to fetch notes');
    }

    const data = (await response.json()) as { notes: NoteDto[] };
    return sortNotes(data.notes.map(mapNote));
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const getNoteById = async (
  user: User,
  noteId: string
): Promise<Note> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Note not found');
    }

    const data = (await response.json()) as { note: NoteDto };
    return mapNote(data.note);
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const deleteNote = async (user: User, noteId: string): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok && response.status !== 204) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to delete note');
    }
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const handleDeleteNote = async (
  e: MouseEvent,
  user: User,
  noteId: string,
  setIsDeleting: Dispatch<SetStateAction<string | null>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  e.preventDefault();
  try {
    setIsDeleting(noteId);
    await deleteNote(user, noteId);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Failed to delete note. Please try again later.');
    }
  } finally {
    setIsDeleting(null);
  }
};

export const updateNote = async (user: User, note: Note): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetch(`${API_URL}/notes/${note.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        title: note.title,
        text: note.text,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to update note');
    }
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const pinNote = async (user: User, note: Note): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetch(`${API_URL}/notes/${note.id}/pin`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to pin note');
    }
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const handleUpdateNote = async (
  note: Note,
  user: User,
  setIsSaving: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    setIsSaving(true);
    await updateNote(user, note);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Failed to update note. Please try again later.');
    }
    throw err;
  } finally {
    setIsSaving(false);
  }
};
