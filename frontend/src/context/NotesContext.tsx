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
        notesLoading: isLoading,
        fetchError: error ? 'Failed to load notes. Please try again.' : null,
        fetchNotes: async () => { await mutate(); },
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
