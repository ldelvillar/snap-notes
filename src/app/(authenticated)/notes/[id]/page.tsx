'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/context/useGlobalContext';
import { useNotes } from '@/context/NotesContext';
import { getNoteById, handleDeleteNote, updateNote } from '@/lib/notesService';
import { Note } from '@/types';
import ContentSkeleton from '@/components/ContentSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import TrashIcon from '@/assets/Trash';
import PencilIcon from '@/assets/Pencil';
import DocumentIcon from '@/assets/Document';
import CalendarIcon from '@/assets/Calendar';

const INITIAL_NOTE: Note = {
  title: '',
  text: '',
  creator: '',
  id: '',
  updatedAt: new Date(0),
  pinnedAt: null,
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
    document.title = note.title + ' - SnapNotes';
  }, [note.title]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchNote = async () => {
      try {
        const noteData = await getNoteById(user, id);
        if (!noteData) {
          setLoadingState({ isLoading: false, error: 'Note not found' });
          return;
        }
        setNote(noteData);
        setEditedNote(noteData);

        // Check if edit mode should be enabled from URL
        const editParam = searchParams.get('edit');
        if (editParam === 'true') setIsEditing(true);
        setLoadingState({ isLoading: false, error: null });
      } catch (err) {
        setLoadingState({
          isLoading: false,
          error:
            err instanceof Error
              ? err.message
              : 'Failed to load note. Please try again.',
        });
      }
    };

    fetchNote();
  }, [id, user, router, authLoading, searchParams]);

  const handleNoteDeletion = async (
    e: React.MouseEvent,
    noteId: string
  ): Promise<void> => {
    if (!user) return;
    await handleDeleteNote(e, user, noteId, setIsDeleting, setDeletionError);
    refetchNotes();
    router.push('/notes');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedNote(note);
  };

  const handleSave = useCallback(async () => {
    if (!user) {
      router.push('/login');
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
            : 'Failed to save changes. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, editedNote, router, refetchNotes]);

  // Listen for Ctrl+S save event
  useEffect(() => {
    const handleSaveEvent = () => {
      if (isEditing) {
        handleSave();
      }
    };
    window.addEventListener('save-note', handleSaveEvent);
    return () => window.removeEventListener('save-note', handleSaveEvent);
  }, [isEditing, handleSave]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNote(note);
  };

  if (loadingState.isLoading || authLoading)
    return <ContentSkeleton lines={6} />;

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
    <article className="relative mx-auto my-16 max-w-7xl rounded-lg px-4 text-text-100 md:px-20">
      <div className="absolute top-2 right-2">
        <button
          onClick={e => handleNoteDeletion(e, note.id)}
          className="group z-20 rounded-full p-2 transition-colors hover:bg-gray-500"
          disabled={isDeleting === note.id || isEditing}
          aria-label="Delete note"
        >
          {isDeleting === note.id ? (
            <div
              className="size-5 animate-spin rounded-full border-b-2 border-gray-900"
              role="status"
              aria-label="Deleting note"
            />
          ) : (
            <TrashIcon className="size-5 transition-colors group-hover:text-red-600" />
          )}
        </button>
      </div>

      <div className="absolute top-2 right-12">
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className="group z-20 rounded-full p-2 transition-colors hover:bg-gray-500"
          disabled={isDeleting === note.id || isSaving}
          aria-label={isEditing ? 'Save note' : 'Edit note'}
        >
          {isSaving ? (
            <div
              className="size-5 animate-spin rounded-full border-b-2 border-gray-900"
              role="status"
              aria-label="Saving note"
            />
          ) : (
            <PencilIcon
              className={`size-5 ${
                isEditing ? 'text-primary' : 'group-hover:text-primary'
              } transition-colors`}
            />
          )}
        </button>
      </div>

      {/* Edit mode */}
      {isEditing ? (
        <div className="pt-10">
          <input
            type="text"
            value={editedNote.title}
            onChange={e =>
              setEditedNote({ ...editedNote, title: e.target.value })
            }
            className="mb-6 w-full border-b border-border px-2 py-1 text-3xl font-bold text-text-100 transition-colors focus:border-primary focus:outline-none"
          />
          <textarea
            value={editedNote.text}
            onChange={e =>
              setEditedNote({ ...editedNote, text: e.target.value })
            }
            className="min-h-[200px] w-full rounded border border-border px-2 py-1 text-lg text-text-100 transition-colors focus:border-primary focus:outline-none"
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View mode */
        <>
          <h1 className="mb-6 text-3xl font-bold">{note.title}</h1>
          <div className="mb-6 flex items-center gap-4 text-sm text-text-400">
            <span className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              {note.updatedAt.toLocaleDateString('en-GB', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <DocumentIcon className="size-4" /> {note.text.length}{' '}
              {note.text.length === 1 ? 'character' : 'characters'}
            </span>
          </div>
          <div className="text-lg leading-relaxed whitespace-pre-wrap">
            {note.text}
          </div>
        </>
      )}
    </article>
  );
}
