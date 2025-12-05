import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import CrossIcon from '@/assets/Cross';
import DocumentIcon from '@/assets/Document';
import Magnifier from '@/assets/Magnifier';
import { useNotes } from '@/context/NotesContext';
import { useFocusTrap, useEscapeKey } from '@/hooks/useModalAccessibility';

interface SearchResultsProps {
  setSearchOpen: (open: boolean) => void;
}

export default function SearchResults({ setSearchOpen }: SearchResultsProps) {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const isEmpty = searchQuery.trim() === '';
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useFocusTrap<HTMLDivElement>();

  const closeModal = useCallback(() => setSearchOpen(false), [setSearchOpen]);
  useEscapeKey(closeModal);

  // Close search results when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close if clicking on the overlay (outside modal)
      if (overlayRef.current && overlayRef.current === event.target) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSearchOpen]);

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs md:bg-black/40 md:p-4"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search notes"
        className="animate-in fade-in zoom-in-95 h-full w-full bg-bg-800 shadow-2xl duration-200 md:h-auto md:max-w-2xl md:rounded-xl md:border md:border-border"
      >
        {/* Header with input */}
        <div className="border-b border-border p-4 md:p-6">
          <div className="flex items-center gap-3 rounded-lg bg-bg-700 px-4 py-3">
            <Magnifier className="size-5 shrink-0 text-text-300" />
            <input
              autoFocus
              className="flex-1 bg-transparent text-lg font-medium text-text-100 placeholder-text-400 focus:outline-none"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="rounded-lg p-2 text-text-300 transition-colors hover:bg-bg-600 hover:text-text-100"
              aria-label="Close search"
            >
              <CrossIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto md:max-h-96">
          {isEmpty ? (
            <div className="p-4 md:p-6">
              <h3 className="mb-4 text-xs font-semibold tracking-wide text-text-400">
                RECENT NOTES
              </h3>
              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map(note => (
                    <Link
                      key={note.id}
                      href={`/notes/${note.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-bg-700"
                    >
                      <DocumentIcon className="size-5 shrink-0 text-text-300" />
                      <div className="min-w-0 flex-1">
                        <p className="group-hover:text-text-50 truncate text-sm font-medium text-text-100 transition-colors">
                          {note.title}
                        </p>
                        <p className="truncate text-xs text-text-400">
                          {note.text.substring(0, 50)}
                          {note.text.length > 50 ? '...' : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-text-400">
                  No notes yet
                </p>
              )}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="space-y-2 p-4 md:p-6">
              {filteredNotes.map(note => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  onClick={() => setSearchOpen(false)}
                  className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-bg-700"
                >
                  <DocumentIcon className="size-5 shrink-0 text-text-300" />
                  <div className="min-w-0 flex-1">
                    <p className="group-hover:text-text-50 truncate text-sm font-medium text-text-100 transition-colors">
                      {note.title}
                    </p>
                    <p className="truncate text-xs text-text-400">
                      {note.text.substring(0, 50)}
                      {note.text.length > 50 ? '...' : ''}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center md:p-6">
              <p className="text-sm text-text-300">
                No results found for &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
