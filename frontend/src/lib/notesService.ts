import {
  User,
  Note,
  NoteDto,
  NoteListItem,
  NoteListItemDto,
} from '@/types/index';
import { getCsrfToken, resetCsrfToken } from '@/lib/csrf';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

async function fetchWithCsrf(
  url: string,
  buildOptions: (csrfToken: string) => RequestInit
): Promise<Response> {
  let token = await getCsrfToken();
  let response = await fetch(url, buildOptions(token));

  if (response.status === 403) {
    resetCsrfToken();
    token = await getCsrfToken();
    response = await fetch(url, buildOptions(token));
  }

  return response;
}

const mapNote = (note: NoteDto): Note => ({
  id: note.id,
  title: note.title,
  text: note.text,
  creator: note.creator,
  updatedAt: new Date(note.updatedAt),
  pinnedAt: note.pinnedAt ? new Date(note.pinnedAt) : null,
});

export const createNote = async (
  user: User,
  title: string,
  text: string
): Promise<Note> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetchWithCsrf(`${API_URL}/notes`, token => ({
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
      credentials: 'include',
      body: JSON.stringify({ title, text }),
    }));

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to create note');
    }

    const data = (await response.json()) as { note: NoteDto };
    return mapNote(data.note);
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const noteToListItem = ({ text: _, ...rest }: Note): NoteListItem => ({
  ...rest,
  textPreview: _.substring(0, 150),
});

export const getNotes = async (user: User): Promise<NoteListItem[]> => {
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

    const data = (await response.json()) as { notes: NoteListItemDto[] };
    return data.notes.map(dto => ({
      id: dto.id,
      title: dto.title,
      textPreview: dto.textPreview,
      creator: dto.creator,
      updatedAt: new Date(dto.updatedAt),
      pinnedAt: dto.pinnedAt ? new Date(dto.pinnedAt) : null,
    }));
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
    const response = await fetchWithCsrf(
      `${API_URL}/notes/${noteId}`,
      token => ({
        method: 'DELETE',
        headers: { 'X-CSRF-Token': token },
        credentials: 'include',
      })
    );

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

export const updateNote = async (user: User, note: Note): Promise<Note> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetchWithCsrf(
      `${API_URL}/notes/${note.id}`,
      token => ({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
        credentials: 'include',
        body: JSON.stringify({ title: note.title, text: note.text }),
      })
    );

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to update note');
    }

    const data = (await response.json()) as { note: NoteDto };
    return mapNote(data.note);
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const pinNote = async (
  user: User,
  note: NoteListItem
): Promise<Note> => {
  if (!user) throw new Error('User is not defined');

  try {
    const response = await fetchWithCsrf(
      `${API_URL}/notes/${note.id}/pin`,
      token => ({
        method: 'PATCH',
        headers: { 'X-CSRF-Token': token },
        credentials: 'include',
      })
    );

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;
      throw new Error(data?.message || 'Failed to pin note');
    }

    const data = (await response.json()) as { note: NoteDto };
    return mapNote(data.note);
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};
