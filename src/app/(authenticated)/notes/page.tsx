"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import ErrorMessage from "@/components/ErrorMessage";
import { useAuth } from "@/context/useGlobalContext";
import { useNotes } from "@/context/NotesContext";
import { getNotes, handleDeleteNote } from "@/lib/notesService";
import { Note } from "@/types/index";
import PlusIcon from "@/assets/Plus";
import TrashIcon from "@/assets/Trash";
import DocumentIcon from "@/assets/Document";

export default function Home() {
  const { user } = useAuth();
  const { registerRefetch, refetchNotes } = useNotes();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getNotes(user);
      // Ordenar las notas de más reciente a más antigua
      const sortedData = data.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
      setNotes(sortedData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch notes, please try again later");
      }
    }
  }, [user]);

  useEffect(() => {
    document.title = "Your Notes | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Manage your notes with SnapNotes");
  }, []);

  useEffect(() => {
    const loadNotes = async () => {
      if (!user) return;
      try {
        const data = await getNotes(user);
        // Ordenar las notas de más reciente a más antigua
        const sortedData = data.sort((a, b) => {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
        setNotes(sortedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch notes, please try again later");
        }
      }
    };

    loadNotes();
  }, [user]);

  // Register this component's fetchNotes with the context
  useEffect(() => {
    registerRefetch(fetchNotes);
  }, [registerRefetch, fetchNotes]);

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
    <section id="notes" className="py-8 md:py-12 px-4 md:px-20 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl md:text-4xl text-gray-100 font-bold">
            {notes.length === 0 ? "Your Notes" : "Your Notes"}
          </h1>
          <p className="text-gray-400">
            {notes.length === 0
              ? "Start creating your first note"
              : `${notes.length} ${
                  notes.length === 1 ? "note" : "notes"
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
      {notes.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="mb-6 size-24 flex items-center justify-center bg-gray-800 rounded-full">
            <DocumentIcon className="size-12 text-gray-500" />
          </div>
          <h3 className="mb-2 text-xl text-gray-300 font-semibold">
            No notes yet
          </h3>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group relative bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-primary/50 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              <Link href={`/notes/${note.id}`} className="p-5 block">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="flex-1 text-lg font-semibold text-gray-100 line-clamp-2">
                    {note.title || "Untitled Note"}
                  </h3>
                </div>
                <p className="mb-4 text-sm text-gray-400 line-clamp-3">
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
                className="absolute top-3 right-3 p-2 bg-gray-900/80 hover:bg-red-600/90 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                disabled={isDeleting === note.id}
                aria-label="Delete note"
              >
                {isDeleting === note.id ? (
                  <div className="size-5 rounded-full border-b-2 border-white animate-spin" />
                ) : (
                  <TrashIcon className="size-5 text-gray-300 hover:text-white transition-colors" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
