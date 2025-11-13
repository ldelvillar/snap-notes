"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import PencilIcon from "@/assets/Pencil";
import TrashIcon from "@/assets/Trash";
import PinIcon from "@/assets/Pin";
import { useNotes } from "@/context/NotesContext";
import { useAuth } from "@/context/useGlobalContext";
import { handleDeleteNote, pinNote } from "@/lib/notesService";
import { Note } from "@/types";
import PinOff from "@/assets/PinOff";

interface NoteMenuProps {
  note: Note;
  setOpenNoteMenuId: (id: string | null) => void;
  setError: Dispatch<SetStateAction<string | null>>;
}

export default function NoteMenu({
  note,
  setOpenNoteMenuId,
  setError,
}: NoteMenuProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { refetchNotes } = useNotes();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPinning, setIsPinning] = useState(false);

  const handlePin = async (e: React.MouseEvent, note: Note) => {
    if (!user) return;

    e.preventDefault();
    e.stopPropagation();

    try {
      setIsPinning(true);
      await pinNote(user, note);
      refetchNotes();
      setOpenNoteMenuId(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update note. Please try again."
      );
    } finally {
      setIsPinning(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/notes/${noteId}?edit=true`);
    setOpenNoteMenuId(null);
  };

  const handleNoteDeletion = async (
    e: React.MouseEvent,
    noteId: string
  ): Promise<void> => {
    if (!user) return;
    await handleDeleteNote(e, user, noteId, setIsDeleting, setError);
    refetchNotes();
  };

  return (
    <div className="mt-1 w-32 absolute right-0 top-full z-50 text-text-100 bg-bg-sidebar border border-border rounded-lg shadow-lg">
      <div className="py-2">
        <button
          onClick={(e) => handlePin(e, note)}
          disabled={isPinning}
          className="w-full px-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="px-2 py-1 w-full flex items-center gap-2 hover:bg-bg-800 rounded-lg">
            {note.pinnedAt ? (
              <>
                <PinOff className="size-4" />
                <span>{isPinning ? "Unpinning..." : "Unpin"}</span>
              </>
            ) : (
              <>
                <PinIcon className="size-4" />
                <span>{isPinning ? "Pinning..." : "Pin"}</span>
              </>
            )}
          </div>
        </button>

        <button onClick={(e) => handleEdit(e, note.id)} className="w-full px-2">
          <div className="px-2 py-1 w-full flex items-center gap-2 hover:bg-bg-800 rounded-lg">
            <PencilIcon className="size-4" />
            <span>Edit</span>
          </div>
        </button>

        <button
          onClick={(e) => handleNoteDeletion(e, note.id)}
          disabled={isDeleting === note.id}
          className="w-full px-2 text-text-danger"
        >
          {isDeleting === note.id ? (
            <div className="px-2 py-1 w-full flex items-center gap-2">
              <div
                className="size-4 rounded-full border-b-2 border-red-500 animate-spin"
                role="status"
                aria-label="Deleting note"
              />
              Deleting...
            </div>
          ) : (
            <div className="px-2 py-1 w-full flex items-center gap-2 hover:bg-bg-danger rounded-lg">
              <TrashIcon className="size-4" />
              <span>Delete</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
