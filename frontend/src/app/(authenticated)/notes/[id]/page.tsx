'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/context/useGlobalContext';
import { useNotes } from '@/context/NotesContext';
import { getNoteById, deleteNote, updateNote, noteToListItem } from '@/lib/notesService';
import { Note } from '@/types';
import ErrorMessage from '@/components/ErrorMessage';
import TrashIcon from '@/assets/Trash';
import PencilIcon from '@/assets/Pencil';
import CalendarIcon from '@/assets/Calendar';
import DocumentIcon from '@/assets/Document';
import HalfArrow from '@/assets/HalfArrow';
import Tick from '@/assets/Tick';

const TEXT_MAX = 10000;
const TITLE_MAX = 200;

const INITIAL_NOTE: Note = {
  title: '',
  text: '',
  creator: '',
  id: '',
  updatedAt: new Date(0),
  pinnedAt: null,
};

function NoteDetailSkeleton() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-12 md:px-0">
      <div className="mb-8 h-4 w-28 animate-pulse rounded-md bg-bg-800" />
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="h-9 w-2/3 animate-pulse rounded-lg bg-bg-800" />
        <div className="flex gap-2">
          <div className="h-9 w-16 animate-pulse rounded-lg bg-bg-800" />
          <div className="h-9 w-20 animate-pulse rounded-lg bg-bg-800" />
        </div>
      </div>
      <div className="mb-8 h-4 w-48 animate-pulse rounded-md bg-bg-800" />
      <div className="space-y-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 animate-pulse rounded-md bg-bg-800 ${i === 6 ? 'w-2/3' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function NotePage() {
  const { user, loading: authLoading } = useAuth();
  const { mutateNotes } = useNotes();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
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
  const [editError, setEditError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.title = note.title
      ? `${note.title} - SnapNotes`
      : 'Note - SnapNotes';
  }, [note.title]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const editParam = searchParams.get('edit');

    const fetchNote = async () => {
      try {
        const noteData = await getNoteById(user, id);
        if (!noteData) {
          setLoadingState({ isLoading: false, error: 'Note not found' });
          return;
        }
        setNote(noteData);
        setEditedNote(noteData);
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

  // Auto-resize textarea whenever edit mode is active and text changes
  useEffect(() => {
    if (!isEditing) return;
    requestAnimationFrame(() => {
      const el = editTextareaRef.current;
      if (!el) return;
      el.style.height = '0px';
      el.style.height = `${el.scrollHeight}px`;
    });
  }, [isEditing, editedNote.text]);

  const handleNoteDeletion = async (e: React.MouseEvent, noteId: string) => {
    if (!user) return;
    e.preventDefault();
    try {
      setIsDeleting(noteId);
      await deleteNote(user, noteId);
      await mutateNotes(notes => notes.filter(n => n.id !== noteId));
      router.push('/notes');
    } catch (err) {
      setDeletionError(
        err instanceof Error
          ? err.message
          : 'Failed to delete note. Please try again later.'
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedNote(note);
    setEditError(null);
  };

  const handleSave = useCallback(async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (editedNote.title.length > TITLE_MAX) {
      setEditError(`Title must be less than ${TITLE_MAX} characters`);
      return;
    }
    if (!editedNote.text.trim()) {
      setEditError('Note text is required');
      return;
    }
    try {
      setIsSaving(true);
      setEditError(null);
      const updatedNote = await updateNote(user, editedNote);
      setNote(updatedNote);
      setIsEditing(false);
      await mutateNotes(notes => notes.map(n => n.id === updatedNote.id ? noteToListItem(updatedNote) : n));
    } catch (err) {
      setEditError(
        err instanceof Error
          ? err.message
          : 'Failed to save changes. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }, [user, editedNote, router, mutateNotes]);

  useEffect(() => {
    const handleSaveEvent = () => {
      if (isEditing) handleSave();
    };
    window.addEventListener('save-note', handleSaveEvent);
    return () => window.removeEventListener('save-note', handleSaveEvent);
  }, [isEditing, handleSave]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNote(note);
    setEditError(null);
  };

  if (loadingState.isLoading || authLoading) return <NoteDetailSkeleton />;

  if (loadingState.error || deletionError) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-12 md:px-0">
        <ErrorMessage message={(loadingState.error || deletionError)!} />
      </div>
    );
  }

  const charCount = editedNote.text.length;
  const charWarning = charCount > TEXT_MAX * 0.9;
  const charOver = charCount > TEXT_MAX;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 text-text-100 md:px-0">
      {/* Back */}
      <Link
        href="/notes"
        className="mb-8 inline-flex items-center gap-1 text-sm text-text-400 transition-colors hover:text-text-100"
      >
        <HalfArrow className="size-4 rotate-180" />
        Back to notes
      </Link>

      {isEditing ? (
        /* ── Edit mode ── */
        <>
          <h1 className="mb-6 text-3xl font-bold text-text-100">Edit note</h1>

          {editError && (
            <div className="mb-6">
              <ErrorMessage message={editError} />
            </div>
          )}

          <div
            className={`rounded-xl border bg-bg-800 shadow-sm transition-colors ${
              editError ? 'border-red-400/50' : 'border-border'
            }`}
          >
            {/* Title */}
            <div className="px-6 pt-6">
              <input
                type="text"
                value={editedNote.title}
                onChange={e =>
                  setEditedNote({ ...editedNote, title: e.target.value })
                }
                placeholder="Note title"
                maxLength={TITLE_MAX}
                disabled={isSaving}
                className="w-full bg-transparent text-xl font-semibold text-text-100 placeholder:text-text-400 focus:outline-none disabled:opacity-60"
              />
            </div>

            {/* Divider */}
            <div className="mx-6 my-4 border-b border-border" />

            {/* Text */}
            <div className="px-6 pb-4">
              <textarea
                ref={editTextareaRef}
                value={editedNote.text}
                onChange={e =>
                  setEditedNote({ ...editedNote, text: e.target.value })
                }
                placeholder="Start writing..."
                disabled={isSaving}
                className="w-full resize-none bg-transparent text-sm leading-relaxed text-text-100 placeholder:text-text-400 focus:outline-none disabled:opacity-60"
                style={{ minHeight: '220px' }}
              />
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-end border-t border-border px-6 py-3">
              <span
                className={`text-xs tabular-nums transition-colors ${
                  charOver
                    ? 'text-red-400'
                    : charWarning
                      ? 'text-amber-500'
                      : 'text-text-400'
                }`}
              >
                {charCount} / {TEXT_MAX}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-text-300 transition-colors hover:bg-bg-800 hover:text-text-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || charOver}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <div
                  className="size-4 animate-spin rounded-full border-b-2 border-white"
                  role="status"
                  aria-label="Saving"
                />
              ) : (
                <Tick className="size-4" />
              )}
              {isSaving ? 'Saving...' : 'Save changes (Ctrl+S)'}
            </button>
          </div>
        </>
      ) : (
        /* ── View mode ── */
        <>
          {/* Title row */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <h1 className="min-w-0 text-3xl leading-tight font-bold">
              {note.title || 'Untitled'}
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={handleEdit}
                disabled={!!isDeleting}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-300 transition-colors hover:border-primary/50 hover:bg-bg-800 hover:text-primary disabled:opacity-50"
              >
                <PencilIcon className="size-3.5" />
                Edit
              </button>
              <button
                onClick={e => handleNoteDeletion(e, note.id)}
                disabled={isDeleting === note.id}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-300 transition-colors hover:border-red-400/50 hover:bg-bg-danger hover:text-text-danger disabled:opacity-50"
              >
                {isDeleting === note.id ? (
                  <div
                    className="size-3.5 animate-spin rounded-full border-b-2 border-current"
                    role="status"
                    aria-label="Deleting"
                  />
                ) : (
                  <TrashIcon className="size-3.5" />
                )}
                {isDeleting === note.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border bg-bg-800 shadow-sm">
            {/* Body */}
            <div className="px-6 py-6 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-text-200">
              {note.text}
            </div>

            {/* Metadata footer */}
            <div className="flex items-center gap-4 border-t border-border px-6 py-3 text-xs text-text-400">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="size-3.5" />
                {note.updatedAt.toLocaleDateString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <DocumentIcon className="size-3.5" />
                {note.text.length}{' '}
                {note.text.length === 1 ? 'character' : 'characters'}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
