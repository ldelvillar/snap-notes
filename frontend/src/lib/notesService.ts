import type { MouseEvent, Dispatch, SetStateAction } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { User, Note } from '@/types/index';

export const createNote = async (
  user: User,
  title: string,
  text: string
): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    const noteRef = doc(collection(db, 'Notes'));

    const newNote: Note = {
      id: noteRef.id,
      title: title || 'Untitled',
      text,
      creator: user.email,
      updatedAt: new Date(),
      pinnedAt: null,
    };
    await setDoc(noteRef, newNote);
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const getNotes = async (user: User): Promise<Note[]> => {
  if (!user) throw new Error('User is not defined');

  try {
    const q = query(
      collection(db, 'Notes'),
      where('creator', '==', user.email),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const dataArr = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamp to JavaScript Date
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
        pinnedAt: data.pinnedAt?.toDate
          ? data.pinnedAt.toDate()
          : data.pinnedAt,
      };
    }) as Note[];

    // Separate pinned and unpinned notes
    const pinnedNotes = dataArr.filter(note => note.pinnedAt !== null);
    const unpinnedNotes = dataArr.filter(note => note.pinnedAt === null);

    // Sort pinned notes by pinnedAt descending (most recently pinned first)
    pinnedNotes.sort((a, b) => {
      const dateA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
      const dateB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
      return dateB - dateA;
    });

    // Return pinned notes first, then unpinned notes
    return [...pinnedNotes, ...unpinnedNotes];
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
    const noteRef = doc(db, 'Notes', noteId);
    const noteSnap = await getDoc(noteRef);
    if (!noteSnap.exists()) throw new Error('Note not found');

    const data = noteSnap.data();

    // Verify the note belongs to the user
    if (data.creator !== user.email) throw new Error('Note not found');

    return {
      ...data,
      id: noteSnap.id,
      updatedAt: data.updatedAt?.toDate
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt),
      pinnedAt: data.pinnedAt?.toDate ? data.pinnedAt.toDate() : data.pinnedAt,
    } as Note;
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const deleteNote = async (user: User, noteId: string): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    const noteRef = doc(db, 'Notes', noteId);
    const noteSnap = await getDoc(noteRef);
    if (!noteSnap.exists()) throw new Error('Note not found');

    const data = noteSnap.data();

    // Verify the note belongs to the user
    if (data.creator !== user.email) throw new Error('Note not found');

    // Delete the note
    await deleteDoc(noteRef);
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
    const noteRef = doc(db, 'Notes', note.id);
    await setDoc(
      noteRef,
      {
        ...note,
        creator: user.email, // Ensure creator remains unchanged
        updatedAt: new Date(), // Update the updatedAt timestamp
      },
      { merge: true }
    );
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error('An unknown error occurred');
  }
};

export const pinNote = async (user: User, note: Note): Promise<void> => {
  if (!user) throw new Error('User is not defined');

  try {
    const noteRef = doc(db, 'Notes', note.id);
    const updatedNote = {
      ...note,
      pinnedAt: note.pinnedAt ? null : new Date(),
    };
    await setDoc(noteRef, updatedNote, { merge: true });
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
