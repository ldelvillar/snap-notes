"use client";

import Link from "next/link";
import { useState } from "react";
import Menu from "@/assets/Menu";
import Logo from "@/assets/Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full fixed top-0 text-white z-40 transition-all duration-300 backdrop-blur-lg">
        <div className="container mx-auto p-3 flex items-center justify-between">
          <Link href="/" className="flex items-center font-bold text-lg">
            <Logo className="size-8 mr-2 text-primary" />
            SnapNotes
          </Link>

          <nav className="hidden lg:flex lg:items-center space-x-8 text-base">
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
              className="px-4 py-2 bg-primary font-bold text-white rounded-xl hover:bg-primary/90 transition duration-300"
            >
              Go to SnapNotes
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            className="lg:hidden focus:outline-none"
          >
            <Menu className="size-6" />
          </button>
        </div>

        <nav
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } p-4 space-y-4 h-screen backdrop-blur-lg lg:hidden`}
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
            className="px-4 py-2 bg-primary font-bold text-white rounded-xl hover:bg-primary/90 transition duration-300"
          >
            Go to SnapNotes
          </Link>
        </nav>
      </header>
    </>
  );
}
