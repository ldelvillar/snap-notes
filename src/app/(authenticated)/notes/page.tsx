"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/useGlobalContext";
import { getNotes, handleDeleteNote } from "@/lib/notesService";
import ContentSkeleton from "@/components/ContentSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import { Note } from "@/types/index";
import PlusIcon from "@/assets/Plus";
import TrashIcon from "@/assets/Trash";

export default function Home() {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.title = "Your Notes | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Manage your notes with SnapNotes");
  }, []);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getNotes(user);
      setNotes(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch notes, please try again later");
      }
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleNoteDeletion = async (
    e: React.MouseEvent,
    noteId: string
  ): Promise<void> => {
    await handleDeleteNote(e, noteId, setIsDeleting, setError);
    await fetchNotes();
  };

  if (loading) {
    return (
      <div className="mt-12 md:mx-20">
        <ContentSkeleton lines={6} />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  if (error) {
    return (
      <div className="mt-12 md:mx-20">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <section id="notes" className="mt-24 md:mt-12 mx-10 md:mx-20">
      <h2 className="text-3xl text-gray-200 font-bold">
        {notes.length === 0 ? "You have no notes" : "Your notes:"}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {notes.map((note) => (
          <Link
            href={`/notes/${note.id}`}
            key={note.id}
            className="bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg flex flex-row justify-between items-center p-4"
          >
            <h3 className="text-lg font-normal truncate">{note.title}</h3>
            <button
              onClick={(e) => handleNoteDeletion(e, note.id)}
              className="z-20 p-2 hover:bg-gray-400 rounded-full transition-colors"
              disabled={isDeleting === note.id}
              aria-label="Delete note"
            >
              {isDeleting === note.id ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
              ) : (
                <TrashIcon className="text-gray-700 hover:text-red-600 transition-colors" />
              )}
            </button>
          </Link>
        ))}
      </div>
      <Link
        href="/notes/create"
        className="flex items-center bg-primary hover:bg-primary/90 transition-colors text-white text-lg font-medium pl-4 pr-8 py-4 mt-10 rounded-lg lg:w-1/3"
      >
        <PlusIcon className="mr-2" /> Create new note
      </Link>
    </section>
  );
}
