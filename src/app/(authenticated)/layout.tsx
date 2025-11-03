"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useGlobalContext";
import { NotesProvider, useNotes } from "@/context/NotesContext";
import { getNotes } from "@/lib/notesService";
import { Note } from "@/types";
import Sidebar from "@/components/Sidebar";
import ContentSkeleton from "@/components/ContentSkeleton";

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { registerRefetch } = useNotes();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    try {
      setNotesLoading(true);
      const data = await getNotes(user);
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setNotesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  useEffect(() => {
    registerRefetch(fetchNotes);
  }, [registerRefetch, fetchNotes]);

  if (loading || !user) {
    return (
      <div className="mt-12 md:mx-20">
        <ContentSkeleton lines={6} />
      </div>
    );
  }

  return (
    <div className="bg-[#242424]">
      <Sidebar
        notes={notes}
        notesLoading={notesLoading}
        refetchNotes={fetchNotes}
      >
        {children}
      </Sidebar>
    </div>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotesProvider>
      <AuthenticatedContent>{children}</AuthenticatedContent>
    </NotesProvider>
  );
}
