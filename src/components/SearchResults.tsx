import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import CrossIcon from "@/assets/Cross";
import DocumentIcon from "@/assets/Document";
import Magnifier from "@/assets/Magnifier";
import { useNotes } from "@/context/NotesContext";

interface SearchResultsProps {
  setSearchOpen: (open: boolean) => void;
}

export default function SearchResults({ setSearchOpen }: SearchResultsProps) {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const isEmpty = searchQuery.trim() === "";
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close if clicking on the overlay (outside modal)
      if (overlayRef.current && overlayRef.current === event.target) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchOpen]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      ref={overlayRef}
      className="md:p-4 fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs md:bg-black/40"
    >
      <div className="w-full h-full md:h-auto md:max-w-2xl md:rounded-xl bg-bg-800 md:border md:border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header with input */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="px-4 py-3 flex items-center gap-3 bg-bg-700 rounded-lg">
            <Magnifier className="size-5 text-text-300 shrink-0" />
            <input
              autoFocus
              className="flex-1 bg-transparent text-lg font-medium text-text-100 placeholder-text-400 focus:outline-none"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 rounded-lg hover:bg-bg-600 transition-colors text-text-300 hover:text-text-100"
              aria-label="Close search"
            >
              <CrossIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[calc(100vh-5rem)] md:max-h-96 overflow-y-auto">
          {isEmpty ? (
            <div className="p-4 md:p-6">
              <h3 className="mb-4 text-xs font-semibold text-text-400 tracking-wide">
                RECENT NOTES
              </h3>
              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <Link
                      key={note.id}
                      href={`/notes/${note.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="p-3 flex items-center gap-3 rounded-lg hover:bg-bg-700 transition-colors group"
                    >
                      <DocumentIcon className="size-5 text-text-300 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-100 truncate group-hover:text-text-50 transition-colors">
                          {note.title}
                        </p>
                        <p className="text-xs text-text-400 truncate">
                          {note.text.substring(0, 50)}
                          {note.text.length > 50 ? "..." : ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-text-400 py-8">
                  No notes yet
                </p>
              )}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="p-4 md:p-6 space-y-2">
              {filteredNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  onClick={() => setSearchOpen(false)}
                  className="p-3 flex items-center gap-3 rounded-lg hover:bg-bg-700 transition-colors group"
                >
                  <DocumentIcon className="size-5 text-text-300 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-100 truncate group-hover:text-text-50 transition-colors">
                      {note.title}
                    </p>
                    <p className="text-xs text-text-400 truncate">
                      {note.text.substring(0, 50)}
                      {note.text.length > 50 ? "..." : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 md:p-6 text-center">
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
