"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ErrorMessage from "@/components/ErrorMessage";
import { useNotes } from "@/context/NotesContext";
import { handleDeleteNote } from "@/lib/notesService";
import PlusIcon from "@/assets/Plus";
import TrashIcon from "@/assets/Trash";
import DocumentIcon from "@/assets/Document";

export default function Home() {
  const { notes, refetchNotes } = useNotes();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sort notes by date (most recent first)
  const sortedNotes = [...notes].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  useEffect(() => {
    document.title = "Your Notes | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Manage your notes with SnapNotes");
  }, []);

  const handleNoteDeletion = async (
    e: React.MouseEvent,
    noteId: string
  ): Promise<void> => {
    await handleDeleteNote(e, noteId, setIsDeleting, setError);
    refetchNotes();
  };

  if (error) {
    return (
      <div className="mt-12 mx-4 md:mx-20">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <section id="notes" className="py-16 px-4 md:px-20 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl md:text-4xl text-text-100 font-bold">
            Your notes
          </h1>
          <p className="text-text-400">
            {sortedNotes.length === 0
              ? "Start creating your first note"
              : `${sortedNotes.length} ${
                  sortedNotes.length === 1 ? "note" : "notes"
                } total`}
          </p>
        </div>
        <Link
          href="/notes/create"
          className="px-6 py-3 flex items-center justify-center gap-2 text-white font-medium bg-primary hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 hover:shadow-primary/30"
        >
          <PlusIcon className="size-5" />
          <span>Create note</span>
        </Link>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="mb-6 size-24 flex items-center justify-center bg-bg-800 rounded-full">
            <DocumentIcon className="size-12 text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl text-text-300 font-semibold">
            No notes yet
          </h2>
          <p className="mb-6 max-w-md text-gray-500">
            Get started by creating your first note. Organize your thoughts,
            ideas, and tasks all in one place.
          </p>
          <Link
            href="/notes/create"
            className="px-6 py-3 flex items-center gap-2 text-white font-medium bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            <PlusIcon className="size-5" />
            Create Your First Note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="group relative bg-linear-to-br from-bg-800 to-bg-900 border border-border hover:border-primary/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              <Link href={`/notes/${note.id}`} className="p-5 block">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="flex-1 text-lg font-semibold text-text-100 line-clamp-2">
                    {note.title || "Untitled Note"}
                  </h2>
                </div>
                <p className="mb-4 text-sm text-text-400 line-clamp-3">
                  {note.text}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {note.updatedAt.toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>

              {/* Delete Button */}
              <button
                onClick={(e) => handleNoteDeletion(e, note.id)}
                className="p-2 absolute top-3 right-3 z-10 text-text-300 bg-bg-900/80 rounded-lg transition-all hover:text-white hover:bg-red-600/90 opacity-0 group-hover:opacity-100"
                disabled={isDeleting === note.id}
                aria-label="Delete note"
              >
                {isDeleting === note.id ? (
                  <div
                    className="size-5 rounded-full border-b-2 border-white animate-spin"
                    role="status"
                    aria-label="Deleting note"
                  />
                ) : (
                  <TrashIcon className="size-5 transition-colors" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
