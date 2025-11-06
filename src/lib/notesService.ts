import React from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "@/config/firebase";
import { User, Note } from "@/types/index";

export const createNote = async (
  user: User,
  e: React.FormEvent,
  title: string,
  text: string
): Promise<void> => {
  e.preventDefault();
  if (!user) throw new Error("User is not defined");

  try {
    const newNote: Note = {
      id: nanoid(),
      title: title || "Untitled",
      text,
      creator: user.email,
      updatedAt: new Date(),
    };
    await setDoc(doc(collection(db, "Notes")), newNote);
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error("An unknown error occurred");
  }
};

export const getNotes = async (user: User): Promise<Note[]> => {
  if (!user) throw new Error("User is not defined");

  try {
    const q = query(
      collection(db, "Notes"),
      where("creator", "==", user.email)
    );
    const querySnapshot = await getDocs(q);
    const dataArr = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        // Convert Firestore Timestamp to JavaScript Date
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
      };
    }) as Note[];

    return dataArr.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error("An unknown error occurred");
  }
};

export const getNoteById = async (
  user: User,
  noteId: string
): Promise<Note> => {
  if (!user) throw new Error("User is not defined");

  try {
    const noteRef = doc(db, "Notes", noteId);
    const noteSnap = await getDoc(noteRef);
    if (!noteSnap.exists()) throw new Error("Note not found");

    const data = noteSnap.data();

    // Verify the note belongs to the user
    if (data.creator !== user.email) throw new Error("Note not found");

    return {
      ...data,
      id: noteSnap.id,
      updatedAt: data.updatedAt?.toDate
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt),
    } as Note;
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error("An unknown error occurred");
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "Notes", noteId));
  } catch (error) {
    if (error instanceof Error) throw error;
    else throw new Error("An unknown error occurred");
  }
};

export const handleDeleteNote = async (
  e: React.MouseEvent,
  noteId: string,
  setIsDeleting: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> => {
  e.preventDefault();
  try {
    setIsDeleting(noteId);
    await deleteNote(noteId);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to delete note. Please try again later.");
    }
  } finally {
    setIsDeleting(null);
  }
};

export const updateNote = async (user: User, note: Note): Promise<void> => {
  if (!user) throw new Error("User is not defined");

  try {
    const noteRef = doc(db, "Notes", note.id);
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
    else throw new Error("An unknown error occurred");
  }
};

export const handleUpdateNote = async (
  note: Note,
  user: User,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> => {
  if (!user) throw new Error("User is not defined");

  try {
    setIsSaving(true);
    await updateNote(user, note);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to update note. Please try again later.");
    }
    throw err;
  } finally {
    setIsSaving(false);
  }
};
