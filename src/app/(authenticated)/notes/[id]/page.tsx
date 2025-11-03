"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/useGlobalContext";
import { useNotes } from "@/context/NotesContext";
import { getNoteById, handleDeleteNote, updateNote } from "@/lib/notesService";
import { Note } from "@/types";
import ContentSkeleton from "@/components/ContentSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import TrashIcon from "@/assets/Trash";
import PencilIcon from "@/assets/Pencil";

const INITIAL_NOTE: Note = {
  creator: "",
  title: "",
  text: "",
  id: "",
};

export default function NotePage() {
  const { user, loading: authLoading } = useAuth();
  const { refetchNotes } = useNotes();
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note>(INITIAL_NOTE);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState<Note>(INITIAL_NOTE);
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    error: null as string | null,
  });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchNote = async () => {
      try {
        const noteData = await getNoteById(user, id);
        if (!noteData) {
          setLoadingState({ isLoading: false, error: "Note not found" });
          return;
        }
        setNote(noteData);
        setEditedNote(noteData);
        setLoadingState({ isLoading: false, error: null });
      } catch (error) {
        setLoadingState({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }
    };

    fetchNote();
  }, [id, user, router, authLoading]);

  const handleNoteDeletion = async (
    e: React.MouseEvent,
    noteId: string
  ): Promise<void> => {
    await handleDeleteNote(e, noteId, setIsDeleting, setDeletionError);
    refetchNotes(); // Update sidebar after deletion
    router.push("/notes");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedNote(note);
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      setIsSaving(true);
      await updateNote(user, editedNote);
      setNote(editedNote);
      setIsEditing(false);
      refetchNotes(); // Update sidebar after editing
    } catch (error) {
      setLoadingState({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to save changes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNote(note);
  };

  if (loadingState.isLoading || authLoading) {
    return (
      <div className="mt-12 md:mx-20">
        <ContentSkeleton lines={6} />
      </div>
    );
  }

  if (loadingState.error) {
    return (
      <div className="mt-12 md:mx-20">
        <ErrorMessage message={loadingState.error} />
      </div>
    );
  }

  if (deletionError) {
    return (
      <div className="mt-12 md:mx-20">
        <ErrorMessage message={deletionError} />
      </div>
    );
  }

  return (
    <article className="relative mt-12 mx-10 md:mx-20 text-gray-50 rounded-lg p-6">
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => handleNoteDeletion(e, note.id)}
          className="group p-2 hover:bg-gray-500 z-20 rounded-full transition-colors"
          disabled={isDeleting === note.id || isEditing}
          aria-label="Delete note"
        >
          {isDeleting === note.id ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
          ) : (
            <TrashIcon className="group-hover:text-red-600 transition-colors" />
          )}
        </button>
      </div>
      <div className="absolute top-2 right-12">
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className="group p-2 hover:bg-gray-500 z-20 rounded-full transition-colors"
          disabled={isDeleting === note.id || isSaving}
          aria-label={isEditing ? "Save note" : "Edit note"}
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
          ) : (
            <PencilIcon
              className={`${
                isEditing ? "text-primary" : "group-hover:text-primary"
              } transition-colors`}
            />
          )}
        </button>
      </div>
      {isEditing ? (
        <div className="pt-10">
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) =>
              setEditedNote({ ...editedNote, title: e.target.value })
            }
            className="text-3xl font-bold mb-6 w-full text-gray-50 border rounded px-2 py-1"
          />
          <textarea
            value={editedNote.text}
            onChange={(e) =>
              setEditedNote({ ...editedNote, text: e.target.value })
            }
            className="text-lg w-full min-h-[200px] text-gray-50 border rounded px-2 py-1"
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">{note.title}</h1>
          <div className="text-lg whitespace-pre-wrap leading-relaxed">
            {note.text}
          </div>
        </>
      )}
    </article>
  );
}
