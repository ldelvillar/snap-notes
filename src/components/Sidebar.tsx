"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/context/useGlobalContext";
import { Note } from "@/types";
import AccountMenu from "@/components/AccountMenu";
import MenuIcon from "@/assets/Menu";
import CrossIcon from "@/assets/Cross";
import ArrowIcon from "@/assets/Arrow";
import SidebarArrow from "@/assets/SidebarArrow";
import DocumentIcon from "@/assets/Document";
import EditIcon from "@/assets/Edit";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuOpen &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuOpen]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-opacity-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 text-text-100 bg-bg-sidebar border-r border-border transform transition-all duration-300 ease-in-out h-screen
                    ${
                      isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }
                    ${isCollapsed ? "w-16" : "w-72"}
                    md:relative`}
      >
        {/* Sidebar Header */}
        <div className="px-4 h-16 flex items-center justify-between">
          <Link href="/notes" className="flex items-center space-x-2">
            <Image
              src="/images/brand/logo.webp"
              width={28}
              height={28}
              alt="SnapNotes logo"
              className={`transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            />
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-2 hover:bg-bg-700 hidden md:block"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <SidebarArrow
              className={`size-5 transform transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
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

        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          <div className="space-y-4 px-2 py-4 overflow-y-auto">
            <Link
              href="/notes/create"
              className={`mb-2 p-2 flex items-center font-medium text-text-200 rounded-lg transition-all duration-300 hover:bg-bg-700 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <EditIcon
                className={`inline size-4 ${isCollapsed ? "" : "mr-2"}`}
              />
              <span
                className={`transition-opacity duration-300 ${
                  isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                }`}
              >
                New note
              </span>
            </Link>
          </div>

          <div className="flex-1 space-y-4 px-2 py-4 overflow-y-auto">
            <h2
              className={`mb-2 px-2 text-sm font-medium text-text-400 transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 h-0" : "opacity-100"
              }`}
            >
              Recent
            </h2>
            <nav className="space-y-1">
              {notesLoading ? (
                <div
                  className={`px-2 py-2 text-sm text-text-400 transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0 h-0 hidden" : "opacity-100"
                  }`}
                >
                  Loading notes...
                </div>
              ) : notes.length === 0 ? (
                <div
                  className={`px-2 py-2 text-sm text-text-400 transition-opacity duration-300 ${
                    isCollapsed ? "opacity-0 h-0 hidden" : "opacity-100"
                  }`}
                >
                  No notes yet
                </div>
              ) : (
                notes.map((item) => (
                  <Link
                    key={item.id}
                    href={`/notes/${item.id}`}
                    className={`flex items-center ${
                      isCollapsed ? "justify-center" : "justify-start"
                    } py-2 px-2 text-sm rounded-lg hover:bg-bg-700 group`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className="flex items-center justify-center min-w-0">
                      <span className="shrink-0">
                        <DocumentIcon className="size-5" />
                      </span>
                      <span
                        className={`ml-3 truncate transition-opacity duration-300 ${
                          isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span
                      className={`text-xs text-gray-500 transition-opacity duration-300 ${
                        isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                      } ml-auto`}
                    >
                      <ArrowIcon />
                    </span>
                  </Link>
                ))
              )}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-2" ref={accountMenuRef}>
            <button
              className={`w-full p-2 flex items-center hover:bg-bg-700 rounded-lg ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            >
              <div className="shrink-0">
                <Image
                  src={user.photo || "/images/nopicture.webp"}
                  width={36}
                  height={36}
                  alt="profile picture"
                  className="size-8 rounded-full object-cover"
                />
              </div>

              <div
                className={`min-w-0 flex flex-col items-start transition-opacity duration-300 ${
                  isCollapsed ? "hidden" : "block"
                }`}
              >
                <h3 className="text-sm text-text-100 font-medium truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-text-300 truncate">
                  {notes.length === 1
                    ? notes.length + " note"
                    : notes.length + " notes"}
                </p>
              </div>
            </button>

            {/* Account Menu */}
            {accountMenuOpen && <AccountMenu user={user} />}
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`${
          isMobileOpen ? "hidden" : "block"
        } fixed left-4 top-4 z-40 rounded-lg p-2 bg-white shadow-md hover:bg-gray-100 md:hidden`}
        aria-label="Open sidebar"
      >
        <MenuIcon />
      </button>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-screen overflow-y-auto transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
