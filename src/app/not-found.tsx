"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "404 Not Found | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Oops! The page you are looking for does not exist. Explore Snap Notes for all your note-taking needs."
      );
  }, []);

  return (
    <div className="p-4 min-h-screen flex items-center justify-center text-white animate-fade-in">
      <div className="relative z-10 max-w-md text-center space-y-8">
        {/* 404 Number with animation */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-primary to-[#1d0029] drop-shadow-lg">
          404
        </h1>

        {/* Main message */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>
          <p className="text-lg text-[#b09eb8]">
            It seems this note got lost along the way. Let&apos;s see where we
            are.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-primary font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-[#332938] font-bold rounded-lg hover:bg-[#3a303d] transition-all duration-300 border border-primary/30"
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
