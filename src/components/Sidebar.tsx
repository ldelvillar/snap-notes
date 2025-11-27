'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/context/useGlobalContext';
import { Note } from '@/types';
import AccountMenu from '@/components/AccountMenu';
import SearchResults from '@/components/SearchResults';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import Toast from '@/components/Toast';
import MenuIcon from '@/assets/Menu';
import CrossIcon from '@/assets/Cross';
import SidebarArrow from '@/assets/SidebarArrow';
import DocumentIcon from '@/assets/Document';
import EditIcon from '@/assets/Edit';
import Magnifier from '@/assets/Magnifier';
import ThreeDotsIcon from '@/assets/ThreeDots';
import NoteMenu from '@/components/NoteMenu';
import PinIcon from '@/assets/Pin';

interface SidebarProps {
  children: React.ReactNode;
  notes: Note[];
  notesLoading: boolean;
  refetchNotes: () => void;
}

export default function Sidebar({
  children,
  notes,
  notesLoading,
}: SidebarProps) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [openNoteMenuId, setOpenNoteMenuId] = useState<string | null>(null);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const noteMenuRef = useRef<HTMLDivElement>(null);

  // Check if there is a click-outside for all menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close mobile sidebar
      const sidebar = document.getElementById('sidebar');
      if (isMobileOpen && sidebar && !sidebar.contains(target)) {
        setIsMobileOpen(false);
      }

      // Close account menu
      if (
        accountMenuOpen &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(target)
      ) {
        setAccountMenuOpen(false);
      }

      // Close note menu
      if (
        openNoteMenuId &&
        noteMenuRef.current &&
        !noteMenuRef.current.contains(target)
      ) {
        setOpenNoteMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen, accountMenuOpen, openNoteMenuId, searchOpen]);

  // Listen for global open-search event
  useEffect(() => {
    const handleOpenSearch = (event: Event) => {
      setSearchOpen(prev => !prev);
    };
    window.addEventListener('toggle-search', handleOpenSearch);
    return () => window.removeEventListener('toggle-search', handleOpenSearch);
  }, []);

  // Toggle note menu
  const toggleNoteMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenNoteMenuId(openNoteMenuId === noteId ? null : noteId);
  };

  if (!user) return null;

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 h-screen transform border-r border-border bg-bg-sidebar text-text-100 transition-all duration-300 ease-in-out md:relative ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isCollapsed ? 'w-16' : 'w-72'}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/notes"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center space-x-2"
          >
            <Image
              src="/images/brand/logo.webp"
              width={28}
              height={28}
              alt="SnapNotes logo"
              className={`transition-opacity duration-300 ${
                isCollapsed ? 'w-0 opacity-0' : 'opacity-100'
              }`}
            />
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-lg p-2 hover:bg-bg-700 md:block"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <SidebarArrow
              className={`size-5 transform transition-transform duration-300 ${
                isCollapsed ? 'rotate-180' : ''
              }`}
            />
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-2 hover:bg-bg-700 md:hidden"
            aria-label="Close sidebar"
          >
            <CrossIcon />
          </button>
        </div>

        {/* Main content */}
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
          <div className="scrollbar-hide overflow-y-auto px-2 py-4">
            <Link
              href="/notes/create"
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center rounded-lg p-2 text-text-200 transition-all duration-300 hover:bg-bg-700 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <EditIcon
                className={`inline size-4 ${isCollapsed ? '' : 'mr-2'}`}
              />
              <span
                className={`transition-opacity duration-300 ${
                  isCollapsed ? 'hidden w-0 opacity-0' : 'opacity-100'
                }`}
              >
                New note
              </span>
              <span className="ml-auto hidden text-sm text-text-400 group-hover:inline">
                Ctrl + Alt + N
              </span>
            </Link>

            <button
              onClick={() => {
                setSearchOpen(true);
                setIsMobileOpen(false);
              }}
              className={`group mb-2 flex w-full items-center rounded-lg p-2 text-text-200 transition-all duration-300 hover:bg-bg-700 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <Magnifier
                className={`inline size-4 ${isCollapsed ? '' : 'mr-2'}`}
              />
              <span
                className={`transition-opacity duration-300 ${
                  isCollapsed ? 'hidden w-0 opacity-0' : 'opacity-100'
                }`}
              >
                Search notes
              </span>
              <span className="ml-auto hidden text-sm text-text-400 group-hover:inline">
                Ctrl + K
              </span>
            </button>
          </div>

          <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto px-2 py-4">
            <h2
              className={`mb-2 px-2 text-sm font-medium text-text-400 transition-opacity duration-300 ${
                isCollapsed ? 'h-0 opacity-0' : 'opacity-100'
              }`}
            >
              Recent
            </h2>
            <nav className="space-y-1">
              {notesLoading ? (
                <div
                  className={`px-2 py-2 text-sm text-text-400 transition-opacity duration-300 ${
                    isCollapsed ? 'hidden h-0 opacity-0' : 'opacity-100'
                  }`}
                >
                  Loading notes...
                </div>
              ) : notes.length === 0 ? (
                <div
                  className={`px-2 py-2 text-sm text-text-400 transition-opacity duration-300 ${
                    isCollapsed ? 'hidden h-0 opacity-0' : 'opacity-100'
                  }`}
                >
                  No notes yet
                </div>
              ) : (
                notes.map(note => (
                  <div
                    key={note.id}
                    className="relative"
                    ref={openNoteMenuId === note.id ? noteMenuRef : null}
                  >
                    <Link
                      href={`/notes/${note.id}`}
                      className={`flex items-center ${
                        isCollapsed ? 'justify-center' : 'justify-between'
                      } group rounded-lg px-2 py-2 text-sm hover:bg-bg-700`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div
                        className={`flex min-w-0 flex-1 items-center gap-3 ${
                          isCollapsed ? 'justify-center' : ''
                        }`}
                      >
                        <span className="shrink-0">
                          <DocumentIcon className="size-5" />
                        </span>
                        <span
                          className={`truncate transition-opacity duration-300 ${
                            isCollapsed ? 'hidden w-0 opacity-0' : 'opacity-100'
                          }`}
                        >
                          {note.title}
                        </span>
                      </div>
                      {!isCollapsed && (
                        <div className="flex size-6 items-center justify-center">
                          {note.pinnedAt && (
                            <PinIcon
                              className={`size-4 transition-opacity ${
                                openNoteMenuId === note.id
                                  ? 'opacity-0'
                                  : 'group-hover:opacity-0'
                              }`}
                            />
                          )}

                          <button
                            onClick={e => toggleNoteMenu(e, note.id)}
                            className={`absolute rounded p-1 transition-opacity hover:bg-bg-600 ${
                              openNoteMenuId === note.id
                                ? 'bg-bg-600 opacity-100'
                                : 'opacity-0 group-hover:opacity-100'
                            }`}
                            aria-label="Note options"
                          >
                            <ThreeDotsIcon className="size-4" />
                          </button>
                        </div>
                      )}
                    </Link>

                    {/* Note menu */}
                    {openNoteMenuId === note.id && !isCollapsed && (
                      <NoteMenu
                        note={note}
                        setOpenNoteMenuId={setOpenNoteMenuId}
                        setError={setDeletionError}
                      />
                    )}
                  </div>
                ))
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-2" ref={accountMenuRef}>
            <button
              className={`flex w-full items-center rounded-lg p-2 hover:bg-bg-700 ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              }`}
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            >
              <div className="shrink-0">
                <Image
                  src={user.photo || '/images/nopicture.webp'}
                  width={36}
                  height={36}
                  alt={`${user.firstName} ${user.lastName}'s profile picture`}
                  className="size-8 rounded-full object-cover"
                />
              </div>

              <div
                className={`flex min-w-0 flex-col items-start transition-opacity duration-300 ${
                  isCollapsed ? 'hidden' : 'block'
                }`}
              >
                <h3 className="truncate text-sm font-medium text-text-100">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="truncate text-xs text-text-300">
                  {notes.length === 1
                    ? notes.length + ' note'
                    : notes.length + ' notes'}
                </p>
              </div>
            </button>

            {/* Account Menu */}
            {accountMenuOpen && (
              <AccountMenu
                user={user}
                setAccountMenuOpen={setAccountMenuOpen}
                setIsMobileOpen={setIsMobileOpen}
                setShortcutsOpen={setShortcutsOpen}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`${
          isMobileOpen ? 'hidden' : 'block'
        } fixed top-4 left-2 z-40 p-2 text-text-100 md:hidden`}
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </button>

      {/* Main Content Area */}
      <main className="h-screen w-full flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
        {children}
      </main>

      {searchOpen && <SearchResults setSearchOpen={setSearchOpen} />}
      {shortcutsOpen && (
        <KeyboardShortcuts setShortcutsOpen={setShortcutsOpen} />
      )}

      {/* Toast for deletion errors */}
      {deletionError && (
        <Toast
          message={deletionError}
          type="error"
          onClose={() => setDeletionError(null)}
        />
      )}
    </div>
  );
}
