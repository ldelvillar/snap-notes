'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import ErrorMessage from '@/components/ErrorMessage';
import ContentSkeleton from '@/components/ContentSkeleton';
import { useAuth } from '@/context/useGlobalContext';
import { useNotes } from '@/context/NotesContext';
import PlusIcon from '@/assets/Plus';
import DocumentIcon from '@/assets/Document';
import PinIcon from '@/assets/Pin';
import ThreeDots from '@/assets/ThreeDots';
import NoteMenu from '@/components/NoteMenu';

export default function Home() {
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

  // Check if there is a click-outside for note menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close note menu
      if (
        openNoteMenuId &&
        noteMenuRef.current &&
        !noteMenuRef.current.contains(target)
      ) {
        setOpenNoteMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openNoteMenuId]);

  // Toggle note menu
  const toggleNoteMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenNoteMenuId(openNoteMenuId === noteId ? null : noteId);
  };

  if (loading) return <ContentSkeleton lines={6} />;

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
          <h1 className="mb-2 text-3xl font-bold text-text-100 md:text-4xl">
            Your notes
          </h1>
          <p className="text-text-400">
            {notes.length === 0
              ? 'Start creating your first note'
              : `${notes.length} ${
                  notes.length === 1 ? 'note' : 'notes'
                } total`}
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

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-bg-800">
            <DocumentIcon className="size-12 text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-text-300">
            No notes yet
          </h2>
          <p className="mb-6 max-w-md text-gray-500">
            Get started by creating your first note. Organize your thoughts,
            ideas, and tasks all in one place.
          </p>
          <Link
            href="/notes/create"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
          >
            <PlusIcon className="size-5" />
            Create Your First Note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map(note => (
            <div
              key={note.id}
              className="group relative rounded-xl border border-border bg-linear-to-br from-bg-800 to-bg-900 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
            >
              <Link href={`/notes/${note.id}`} className="block p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 flex-1 text-lg font-semibold text-text-100">
                    {note.title || 'Untitled Note'}
                  </h2>
                </div>
                <p className="mb-4 line-clamp-3 text-sm text-text-400">
                  {note.text}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {note.updatedAt.toLocaleDateString('en-GB', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  {note.pinnedAt && (
                    <PinIcon className="size-4 text-yellow-400" />
                  )}
                </div>
              </Link>

              {/* Toggle note menu */}
              <div className="absolute top-3 right-4 flex items-center gap-1 text-text-200">
                <button
                  onClick={e => toggleNoteMenu(e, note.id)}
                  className={`rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-bg-600 ${
                    openNoteMenuId === note.id ? 'bg-bg-600 opacity-100' : ''
                  }`}
                  aria-label="Note options"
                >
                  <ThreeDots className="size-5" />
                </button>
              </div>

              {/* Note menu */}
              {openNoteMenuId === note.id && (
                <div ref={noteMenuRef}>
                  <NoteMenu
                    note={note}
                    setOpenNoteMenuId={setOpenNoteMenuId}
                    setError={setError}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
