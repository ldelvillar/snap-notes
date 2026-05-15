'use client';

import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import { Note } from '@/types';
import { useAuth } from '@/context/useGlobalContext';
import { getNotes } from '@/lib/notesService';

interface NotesContextType {
  notes: Note[];
  notesLoading: boolean;
  fetchError: string | null;
  fetchNotes: () => Promise<void>;
  mutateNotes: (updater: (notes: Note[]) => Note[]) => Promise<void>;
}

function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.pinnedAt && !b.pinnedAt) return -1;
    if (!a.pinnedAt && b.pinnedAt) return 1;
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const { data, error, isLoading, mutate } = useSWR(
    user ? `/notes/${user.id}` : null,
    () => getNotes(user!),
    { dedupingInterval: 5 * 60 * 1000 }
  );

  return (
    <NotesContext.Provider
      value={{
        notes: data ?? [],
        notesLoading: !user || isLoading,
        fetchError: error ? 'Failed to load notes. Please try again.' : null,
        fetchNotes: async () => { await mutate(); },
        mutateNotes: async (updater) => {
          await mutate(current => sortNotes(updater(current ?? [])), { revalidate: false });
        },
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};
