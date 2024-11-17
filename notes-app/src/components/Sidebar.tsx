'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/useGlobalContext';
import { useRouter } from 'next/navigation';
import { Note } from '@/types';
import { getNotes } from '@/lib/notesService';
import MenuIcon from './icons/Menu';
import CrossIcon from './icons/Cross';
import ErrorMessage from './ErrorMessage';
import ArrowIcon from './icons/Arrow';

export default function Sidebar({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [notes, setNotes] = useState<Note[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = useCallback(async () => {
        if (!user) return;
        try {
            const data = await getNotes(user);
            setNotes(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to fetch notes, please try again later.");
            }
        }
    }, [user]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // Close mobile sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('sidebar');
            if (isMobileOpen && sidebar && !sidebar.contains(event.target as Node)) {
                setIsMobileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileOpen]);

    if (loading) {
        return;
    }

    if (!user) {
        router.push('/login');
        return;
    }

    if (error) {
        return (
            <div className="mt-12 md:mx-20">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen relative">
            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div 
                id="sidebar"
                className={`fixed inset-y-0 left-0 z-50 transform bg-white transition-all duration-300 ease-in-out border-r
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    ${isCollapsed ? 'w-16' : 'w-64'}
                    md:relative`}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo.svg"
                            width={28}
                            height={28}
                            alt='SnapNotes logo'
                            className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}
                        />
                    </Link>
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="rounded-lg p-2 hover:bg-gray-100 hidden md:block"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <svg
                            className={`h-5 w-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button 
                        onClick={() => setIsMobileOpen(false)}
                        className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
                        aria-label="Close sidebar"
                    >
                        <CrossIcon />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
                    <div className="flex-1 space-y-4 p-4 overflow-y-auto">
                        <h2 className={`text-sm font-medium text-gray-500 mb-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
                            Today
                        </h2>
                        <nav className="space-y-1">
                            {notes.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/notes/${item.id}`}
                                    className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} px-3 py-2 text-sm rounded-lg hover:bg-gray-100 group`}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <div className="flex items-center justify-center min-w-0">
                                        <span className="flex-shrink-0">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span className={`ml-3 truncate transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                                            {item.title}
                                        </span>
                                    </div>
                                    <span className={`text-xs text-gray-500 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'} ml-auto`}>
                                        <ArrowIcon />
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="border-t p-4">
                        <Link 
                            href="/account" 
                            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <div className={`flex-shrink-0 ${isCollapsed ? 'w-10 h-10' : ''}`}>
                                <Image
                                    src={user.photo || '/images/nopicture.webp'}
                                    width={36}
                                    height={36}
                                    alt="profile picture"
                                    className="rounded-full w-10 h-10 object-cover"
                                />
                            </div>
                            <div className={`flex-1 min-w-0 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
                                <p className="text-sm font-medium truncate">{user.firstName}</p>
                                <p className="text-xs text-gray-500">{notes.length === 1 ? notes.length + ' note' : notes.length + ' notes'}</p>
                            </div>
                        </Link>
                </div>
                </div>
            </div>

            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-lg p-2 bg-white shadow-md hover:bg-gray-100 md:hidden"
                aria-label="Open sidebar"
            >
                <MenuIcon />
            </button>

            {/* Main Content Area */}
            <main className="flex-1 w-full transition-all duration-300 ease-in-out"
            >
                {children}
            </main>
        </div>
    );
}
