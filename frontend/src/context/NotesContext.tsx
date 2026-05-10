'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    try {
      setNotesLoading(true);
      setFetchError(null);
      const data = await getNotes(user);
      setNotes(data);
    } catch {
      setFetchError('Failed to load notes. Please try again.');
    } finally {
      setNotesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchNotes();
  }, [user, fetchNotes]);

  return (
    <NotesContext.Provider
      value={{ notes, notesLoading, fetchError, fetchNotes }}
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
