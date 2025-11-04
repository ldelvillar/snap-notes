import React from "react";
import {
  collection,
  deleteDoc,
  doc,
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
  if (!user) {
    console.error("User is not defined or missing uid");
    return;
  }
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
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error ocurred");
    }
  }
};

export const getNotes = async (user: User): Promise<Note[]> => {
  if (!user) {
    console.error("User is not defined or missing uid");
    return [];
  }
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

    return dataArr;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error ocurred");
    }
    return [];
  }
};

export const getNoteById = async (
  user: User,
  noteId: string
): Promise<Note | undefined> => {
  const userNotes = await getNotes(user);

  const selectedNote = userNotes.find((note) => note.id === noteId);
  if (!selectedNote) {
    console.error("Note not found");
    return;
  }

  return selectedNote;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "Notes", noteId));
    console.log(`Note with id ${noteId} deleted successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error ocurred");
    }
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
  if (!user) {
    console.error("User is not defined or missing uid");
    return;
  }
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
    if (error instanceof Error) {
      console.error(error.message);
      throw error;
    } else {
      const error = new Error(
        "An unknown error occurred while updating the note"
      );
      console.error(error);
      throw error;
    }
  }
};

export const handleUpdateNote = async (
  note: Note,
  user: User,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> => {
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
