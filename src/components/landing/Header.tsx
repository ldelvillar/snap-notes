'use client';

import Link from 'next/link';
import { useState } from 'react';
import Menu from '@/assets/Menu';
import Logo from '@/assets/Logo';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-40 w-full text-white backdrop-blur-lg transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between p-3">
          <Link href="/" className="flex items-center text-lg font-bold">
            <Logo className="mr-2 size-8 text-primary" />
            SnapNotes
          </Link>

          <nav className="hidden space-x-8 text-base lg:flex lg:items-center">
            <Link href="/features" className="hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-primary">
              Pricing
            </Link>
            <Link href="/faq" className="hover:text-primary">
              FAQ
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
            <Link
              href="/notes"
              className="rounded-xl bg-primary px-4 py-2 font-bold text-white transition duration-300 hover:bg-primary/90"
            >
              Go to SnapNotes
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="focus:outline-none lg:hidden"
          >
            <Menu className="size-6" />
          </button>
        </div>

        <nav
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } h-screen space-y-4 p-4 backdrop-blur-lg lg:hidden`}
        >
          <Link href="/features" className="block hover:text-gray-900">
            Features
          </Link>
          <Link href="/pricing" className="block hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/faq" className="block hover:text-gray-900">
            FAQ
          </Link>
          <Link href="/contact" className="block hover:text-gray-900">
            Contact
          </Link>
          <Link
            href="/notes"
            className="rounded-xl bg-primary px-4 py-2 font-bold text-white transition duration-300 hover:bg-primary/90"
          >
            Go to SnapNotes
          </Link>
        </nav>
      </header>
    </>
  );
}
