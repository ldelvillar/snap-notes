'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import ErrorMessage from '@/components/ErrorMessage';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/context/useGlobalContext';
import { useNotes } from '@/context/NotesContext';
import NoteMenu from '@/components/NoteMenu';
import PlusIcon from '@/assets/Plus';
import DocumentIcon from '@/assets/Document';
import PinIcon from '@/assets/Pin';
import ThreeDots from '@/assets/ThreeDots';
import { Note } from '@/types';

function formatDate(date: Date): string {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function NoteCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-bg-800 p-5">
      <div className="mb-3 h-5 w-3/4 rounded-md bg-bg-700" />
      <div className="mb-4 space-y-2">
        <div className="h-3.5 rounded-md bg-bg-700" />
        <div className="h-3.5 w-5/6 rounded-md bg-bg-700" />
        <div className="h-3.5 w-2/3 rounded-md bg-bg-700" />
      </div>
      <div className="h-3 w-1/4 rounded-md bg-bg-700" />
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  openNoteMenuId: string | null;
  noteMenuRef: React.MutableRefObject<HTMLDivElement | null>;
  toggleNoteMenu: (e: React.MouseEvent, noteId: string) => void;
  setOpenNoteMenuId: (id: string | null) => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

function NoteCard({
  note,
  openNoteMenuId,
  noteMenuRef,
  toggleNoteMenu,
  setOpenNoteMenuId,
  setError,
}: NoteCardProps) {
  const isPinned = !!note.pinnedAt;
  const isMenuOpen = openNoteMenuId === note.id;

  return (
    <div
      className={`group relative flex flex-col rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isPinned
          ? 'border-amber-400/40 bg-linear-to-br from-bg-800 to-bg-900 hover:border-amber-400/60 hover:shadow-amber-400/10'
          : 'border-border bg-linear-to-br from-bg-800 to-bg-900 hover:border-primary/40 hover:shadow-primary/10'
      }`}
    >
      <Link href={`/notes/${note.id}`} className="flex flex-1 flex-col p-5 pr-10">
        <h2 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-text-100">
          {note.title || 'Untitled'}
        </h2>
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-text-400">
          {note.text}
        </p>
        <div className="flex items-center justify-between text-xs text-text-400">
          <span>{formatDate(note.updatedAt)}</span>
          {isPinned && (
            <span className="flex items-center gap-1 font-medium text-amber-500">
              <PinIcon className="size-3" />
              Pinned
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={e => toggleNoteMenu(e, note.id)}
        className={`absolute right-3 top-3 rounded-md p-1 text-text-300 transition-all hover:bg-bg-700 ${
          isMenuOpen ? 'bg-bg-700 opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        aria-label="Note options"
      >
        <ThreeDots className="size-4" />
      </button>

      {isMenuOpen && (
        <div ref={noteMenuRef}>
          <NoteMenu
            note={note}
            setOpenNoteMenuId={setOpenNoteMenuId}
            setError={setError}
          />
        </div>
      )}
    </div>
  );
}

const GRID = 'grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4';

export default function NotesPage() {
  const { loading } = useAuth();
  const { notes } = useNotes();
  const [openNoteMenuId, setOpenNoteMenuId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const noteMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Your Notes | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Manage your notes with SnapNotes');
  }, []);

  const closeNoteMenu = useCallback(() => setOpenNoteMenuId(null), []);
  useClickOutside(noteMenuRef, closeNoteMenu, !!openNoteMenuId);

  const toggleNoteMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenNoteMenuId(openNoteMenuId === noteId ? null : noteId);
  };

  const pinnedNotes = notes.filter(n => n.pinnedAt);
  const unpinnedNotes = notes.filter(n => !n.pinnedAt);

  const sharedCardProps = {
    openNoteMenuId,
    noteMenuRef,
    toggleNoteMenu,
    setOpenNoteMenuId,
    setError,
  };

  if (loading) {
    return (
      <section className="mx-auto min-h-screen max-w-[1800px] px-4 py-16 md:px-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 h-9 w-40 animate-pulse rounded-lg bg-bg-800" />
            <div className="h-4 w-24 animate-pulse rounded-md bg-bg-800" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-lg bg-bg-800" />
        </div>
        <div className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-12 md:mx-20">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <section
      id="notes"
      className="mx-auto min-h-screen max-w-[1800px] px-4 py-16 md:px-20"
    >
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-1.5 text-3xl font-bold text-text-100 md:text-4xl">
            Your notes
          </h1>
          <p className="text-sm text-text-400">
            {notes.length === 0
              ? 'Start creating your first note'
              : `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}${pinnedNotes.length > 0 ? ` · ${pinnedNotes.length} pinned` : ''}`}
          </p>
        </div>
        <Link
          href="/notes/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
        >
          <PlusIcon className="size-5" />
          <span>Create note</span>
        </Link>
      </div>

      {/* Notes */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-bg-800">
            <DocumentIcon className="size-10 text-text-400" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-text-100">
            No notes yet
          </h2>
          <p className="mb-8 max-w-sm text-sm text-text-400">
            Capture your thoughts, ideas, and tasks — all in one place.
          </p>
          <Link
            href="/notes/create"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
          >
            <PlusIcon className="size-5" />
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-text-400">
                <PinIcon className="size-3.5" />
                Pinned
              </h2>
              <div className={GRID}>
                {pinnedNotes.map(note => (
                  <NoteCard key={note.id} note={note} {...sharedCardProps} />
                ))}
              </div>
            </div>
          )}

          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-400">
                  Notes
                </h2>
              )}
              <div className={GRID}>
                {unpinnedNotes.map(note => (
                  <NoteCard key={note.id} note={note} {...sharedCardProps} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
