"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
} from "react";
import { Note } from "@/types";

interface NotesContextType {
  notes: Note[];
  notesLoading: boolean;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setNotesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetchNotes: () => void;
  registerRefetch: (callback: () => Promise<void>) => () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const refetchCallbacks = useRef<Set<() => Promise<void>>>(new Set());

  const registerRefetch = useCallback((callback: () => Promise<void>) => {
    refetchCallbacks.current.add(callback);

    // Return cleanup function to remove callback when component unmounts
    return () => {
      refetchCallbacks.current.delete(callback);
    };
  }, []);

  const refetchNotes = useCallback(() => {
    refetchCallbacks.current.forEach((callback) => {
      callback();
    });
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        notesLoading,
        setNotes,
        setNotesLoading,
        refetchNotes,
        registerRefetch,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return context;
};
