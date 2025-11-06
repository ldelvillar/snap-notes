"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/useGlobalContext";
import { NotesProvider, useNotes } from "@/context/NotesContext";
import { getNotes } from "@/lib/notesService";
import Sidebar from "@/components/Sidebar";
import ContentSkeleton from "@/components/ContentSkeleton";

type Theme = "light" | "dark" | "system";

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { notes, notesLoading, setNotes, setNotesLoading, registerRefetch } =
    useNotes();
  const router = useRouter();

  // Apply theme on mount and listen for system theme changes
  useEffect(() => {
    const applyTheme = (theme: Theme) => {
      let resolvedTheme = theme;
      if (theme === "system") {
        resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
      }
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolvedTheme);
    };

    const theme = (localStorage.getItem("theme") as Theme) || "system";
    applyTheme(theme);

    // Listen for system theme changes when theme is set to "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = () => applyTheme("system");

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, []);

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
  }, [user, setNotes, setNotesLoading]);

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
    <div className="bg-bg-primary">
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
