'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import ContentSkeleton from '@/components/ContentSkeleton';
import { useAuth } from '@/context/useGlobalContext';
import { NotesProvider, useNotes } from '@/context/NotesContext';
import { getNotes } from '@/lib/notesService';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

type Theme = 'light' | 'dark' | 'system';

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { notes, notesLoading, setNotes, setNotesLoading, registerRefetch } =
    useNotes();
  const router = useRouter();
  useKeyboardShortcuts();

  // Apply theme on mount and listen for system theme changes
  useEffect(() => {
    const applyTheme = (theme: Theme) => {
      let resolvedTheme = theme;
      if (theme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
      }
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolvedTheme);
    };

    const theme = (localStorage.getItem('theme') as Theme) || 'system';
    applyTheme(theme);

    // Listen for system theme changes when theme is set to "system"
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => applyTheme('system');

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, []);

  // Apply font on mount and listen for font changes
  useEffect(() => {
    const applyFont = () => {
      const font = localStorage.getItem('font') || 'default';
      document.documentElement.classList.remove('font-display', 'font-roboto');
      if (font === 'default') {
        document.documentElement.classList.add('font-display');
      } else {
        document.documentElement.classList.add('font-roboto');
      }
    };

    applyFont();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'font') {
        applyFont();
      }
    };

    // Listen for custom event from same page
    const handleFontChange = () => {
      applyFont();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fontChange', handleFontChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fontChange', handleFontChange);
    };
  }, []);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    try {
      setNotesLoading(true);
      const data = await getNotes(user);
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setNotesLoading(false);
    }
  }, [user, setNotes, setNotesLoading]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchNotes();
  }, [user, fetchNotes]);

  useEffect(() => {
    registerRefetch(fetchNotes);
  }, [registerRefetch, fetchNotes]);

  if (loading || !user) return <ContentSkeleton lines={6} />;

  return (
    <div id="layout" className="bg-bg-primary">
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
