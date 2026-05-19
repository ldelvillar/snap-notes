'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuth } from '@/context/useGlobalContext';
import { NotesProvider, useNotes } from '@/context/NotesContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

type Theme = 'light' | 'dark' | 'system';

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { notes, notesLoading, fetchError, fetchNotes } = useNotes();
  const router = useRouter();
  useKeyboardShortcuts();

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

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, []);

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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'font') applyFont();
    };
    const handleFontChange = () => applyFont();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fontChange', handleFontChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fontChange', handleFontChange);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div id="layout" className="bg-bg-primary">
      <Sidebar notes={notes} notesLoading={notesLoading}>
        {fetchError ? (
          <div className="mx-4 mt-12 md:mx-20">
            <ErrorMessage message={fetchError} />
          </div>
        ) : (
          children
        )}
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
