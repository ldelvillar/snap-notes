'use client';

import React, { createContext, useContext, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { NoteListItem } from '@/types';
import { useAuth } from '@/context/useGlobalContext';
import { getNotes, NotesPage } from '@/lib/notesService';

const PAGE_LIMIT = 50;

interface NotesContextType {
  notes: NoteListItem[];
  notesLoading: boolean;
  fetchError: string | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  total: number;
  pinnedTotal: number;
  loadMore: () => Promise<void>;
  loadAll: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  mutateNotes: (
    updater: (notes: NoteListItem[]) => NoteListItem[]
  ) => Promise<void>;
}

function sortNotes(notes: NoteListItem[]): NoteListItem[] {
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

  const getKey = (
    pageIndex: number,
    previousPage: NotesPage | null
  ): string | null => {
    if (!user) return null;
    if (previousPage && previousPage.nextCursor === null) return null;
    if (pageIndex === 0) return `/notes/${user.id}?limit=${PAGE_LIMIT}`;
    return `/notes/${user.id}?limit=${PAGE_LIMIT}&cursor=${previousPage!.nextCursor}`;
  };

  const fetcher = async (key: string): Promise<NotesPage> => {
    const cursorMatch = key.match(/cursor=([^&]+)/);
    return getNotes(user!, {
      limit: PAGE_LIMIT,
      cursor: cursorMatch ? cursorMatch[1] : undefined,
    });
  };

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite<NotesPage>(getKey, fetcher, {
      dedupingInterval: 5 * 60 * 1000,
      revalidateFirstPage: true,
    });

  const notes = useMemo(() => {
    if (!data) return [];
    return sortNotes(data.flatMap(p => p.notes));
  }, [data]);

  const lastPage = data && data.length > 0 ? data[data.length - 1] : null;
  const firstPage = data && data.length > 0 ? data[0] : null;
  const hasMore = lastPage ? lastPage.nextCursor !== null : false;
  const total = firstPage?.total ?? 0;
  const pinnedTotal = firstPage?.pinnedTotal ?? 0;
  const isLoadingMore =
    isValidating && data !== undefined && data.length === size && size > 1;

  return (
    <NotesContext.Provider
      value={{
        notes,
        notesLoading: !user || isLoading,
        fetchError: error ? 'Failed to load notes. Please try again.' : null,
        hasMore,
        isLoadingMore,
        total,
        pinnedTotal,
        loadMore: async () => {
          if (!hasMore || isValidating) return;
          await setSize(size + 1);
        },
        loadAll: async () => {
          if (!hasMore || total === 0) return;
          const targetSize = Math.ceil(total / PAGE_LIMIT);
          if (size < targetSize) await setSize(targetSize);
        },
        fetchNotes: async () => {
          await mutate();
        },
        mutateNotes: async updater => {
          await mutate(
            pages => {
              if (!pages || pages.length === 0) return pages;
              const flat = pages.flatMap(p => p.notes);
              const updated = sortNotes(updater(flat));
              const lastNextCursor = pages[pages.length - 1].nextCursor;
              // Adjust totals by the delta so the header stays accurate after
              // create/delete without waiting for a server revalidation.
              const prevTotal = pages[0].total;
              const prevPinnedTotal = pages[0].pinnedTotal;
              const loadedDelta = updated.length - flat.length;
              const loadedPinnedDelta =
                updated.filter(n => n.pinnedAt).length -
                flat.filter(n => n.pinnedAt).length;
              return [
                {
                  notes: updated,
                  nextCursor: lastNextCursor,
                  total: Math.max(0, prevTotal + loadedDelta),
                  pinnedTotal: Math.max(0, prevPinnedTotal + loadedPinnedDelta),
                },
              ];
            },
            { revalidate: false }
          );
          await setSize(1);
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
