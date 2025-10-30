import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#4d3d54] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-24 mb-8">
          <Link
            href="/terms-of-service"
            className="text-[#b09eb8] hover:text-primary transition"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy-policy"
            className="text-[#b09eb8] hover:text-primary transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-[#b09eb8] hover:text-primary transition"
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
