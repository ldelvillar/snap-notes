"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/context/useGlobalContext";
import { useNotes } from "@/context/NotesContext";
import { getNoteById, handleDeleteNote, updateNote } from "@/lib/notesService";
import { Note } from "@/types";
import ContentSkeleton from "@/components/ContentSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import TrashIcon from "@/assets/Trash";
import PencilIcon from "@/assets/Pencil";
import DocumentIcon from "@/assets/Document";
import CalendarIcon from "@/assets/Calendar";

const INITIAL_NOTE: Note = {
  title: "",
  text: "",
  creator: "",
  id: "",
  updatedAt: new Date(0),
};

export default function NotePage() {
  const { user, loading: authLoading } = useAuth();
  const { refetchNotes } = useNotes();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
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
    document.title = note.title + " - SnapNotes";
  }, [note.title]);

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

        // Check if edit mode should be enabled from URL
        const editParam = searchParams.get("edit");
        if (editParam === "true") {
          setIsEditing(true);
        }

        setLoadingState({ isLoading: false, error: null });
      } catch (err) {
        setLoadingState({
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load note. Please try again.",
        });
      }
    };

    fetchNote();
  }, [id, user, router, authLoading, searchParams]);

  const handleNoteDeletion = async (
    e: React.MouseEvent,
    noteId: string
  ): Promise<void> => {
    await handleDeleteNote(e, noteId, setIsDeleting, setDeletionError);
    refetchNotes();
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
      refetchNotes();
    } catch (err) {
      setLoadingState({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to save changes. Please try again.",
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
    <article className="py-16 px-4 md:px-20 relative text-text-100 rounded-lg">
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => handleNoteDeletion(e, note.id)}
          className="group p-2 hover:bg-gray-500 z-20 rounded-full transition-colors"
          disabled={isDeleting === note.id || isEditing}
          aria-label="Delete note"
        >
          {isDeleting === note.id ? (
            <div
              className="size-5 rounded-full border-b-2 border-gray-900 animate-spin"
              role="status"
              aria-label="Deleting note"
            />
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
            <div
              className="size-5 rounded-full border-b-2 border-gray-900 animate-spin"
              role="status"
              aria-label="Saving note"
            />
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
            className="px-2 py-1 mb-6 w-full text-3xl text-text-100 font-bold border-b border-border focus:outline-none focus:border-primary transition-colors"
          />
          <textarea
            value={editedNote.text}
            onChange={(e) =>
              setEditedNote({ ...editedNote, text: e.target.value })
            }
            className="px-2 py-1 w-full min-h-[200px] text-lg text-text-100 border border-border rounded focus:outline-none focus:border-primary transition-colors"
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
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">{note.title}</h1>
          <div className="flex items-center gap-4 mb-6 text-sm text-text-400">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              {note.updatedAt.toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <DocumentIcon className="size-4" /> {note.text.length}{" "}
              {note.text.length === 1 ? "character" : "characters"}
            </span>
          </div>
          <div className="text-lg whitespace-pre-wrap leading-relaxed">
            {note.text}
          </div>
        </>
      )}
    </article>
  );
}
