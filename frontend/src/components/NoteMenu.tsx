'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import PencilIcon from '@/assets/Pencil';
import TrashIcon from '@/assets/Trash';
import PinIcon from '@/assets/Pin';
import { useNotes } from '@/context/NotesContext';
import { useAuth } from '@/context/useGlobalContext';
import { handleDeleteNote, pinNote } from '@/lib/notesService';
import { Note } from '@/types';
import PinOff from '@/assets/PinOff';

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
          : 'Failed to update note. Please try again.'
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
    <div className="absolute top-full right-0 z-50 mt-1 w-32 rounded-lg border border-border bg-bg-sidebar text-text-100 shadow-lg">
      <div className="py-2">
        <button
          onClick={e => handlePin(e, note)}
          disabled={isPinning}
          className="w-full px-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1 hover:bg-bg-800">
            {note.pinnedAt ? (
              <>
                <PinOff className="size-4" />
                <span>{isPinning ? 'Unpinning...' : 'Unpin'}</span>
              </>
            ) : (
              <>
                <PinIcon className="size-4" />
                <span>{isPinning ? 'Pinning...' : 'Pin'}</span>
              </>
            )}
          </div>
        </button>

        <button onClick={e => handleEdit(e, note.id)} className="w-full px-2">
          <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1 hover:bg-bg-800">
            <PencilIcon className="size-4" />
            <span>Edit</span>
          </div>
        </button>

        <button
          onClick={e => handleNoteDeletion(e, note.id)}
          disabled={isDeleting === note.id}
          className="w-full px-2 text-text-danger"
        >
          {isDeleting === note.id ? (
            <div className="flex w-full items-center gap-2 px-2 py-1">
              <div
                className="size-4 animate-spin rounded-full border-b-2 border-red-500"
                role="status"
                aria-label="Deleting note"
              />
              Deleting...
            </div>
          ) : (
            <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1 hover:bg-bg-danger">
              <TrashIcon className="size-4" />
              <span>Delete</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
