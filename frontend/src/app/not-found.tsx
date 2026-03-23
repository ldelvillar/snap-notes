'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = '404 Not Found | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Oops! The page you are looking for does not exist. Explore Snap Notes for all your note-taking needs.'
      );
  }, []);

  return (
    <div className="animate-fade-in flex min-h-screen items-center justify-center p-4 text-white">
      <div className="relative z-10 max-w-md space-y-8 text-center">
        {/* 404 Number with animation */}
        <h1 className="bg-linear-to-b from-primary to-[#1d0029] bg-clip-text text-9xl font-black text-transparent drop-shadow-lg">
          404
        </h1>

        {/* Main message */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold md:text-4xl">Page Not Found</h2>
          <p className="text-lg text-[#b09eb8]">
            It seems this note got lost along the way. Let&apos;s see where we
            are.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="transform rounded-lg bg-primary px-8 py-3 font-bold transition-all duration-300 hover:scale-105 hover:bg-primary/90"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-primary/30 bg-[#332938] px-8 py-3 font-bold transition-all duration-300 hover:bg-[#3a303d]"
          >
            Go Back
          </button>
        </div>

        {/* Footer text */}
        <p className="text-xs text-[#b09eb8]/60">
          Error 404 • The page you are looking for does not exist
        </p>
      </div>
    </div>
  );
}
