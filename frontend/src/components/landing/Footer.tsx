import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#4d3d54] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-center gap-8 md:flex-row md:gap-24">
          <Link
            href="/terms-of-service"
            className="text-[#b09eb8] transition hover:text-primary"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy-policy"
            className="text-[#b09eb8] transition hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-[#b09eb8] transition hover:text-primary"
          >
            Contact Us
          </Link>
        </div>

        <p className="text-center text-[#b09eb8]">
          © 2025 Snap Notes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
