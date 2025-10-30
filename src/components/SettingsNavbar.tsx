"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsNavbarProps {
  children: React.ReactNode;
}

type Tab = "general" | "account" | "privacy" | "billing";

export default function SettingsNavbar({ children }: SettingsNavbarProps) {
  const pathname = usePathname();

  const getActiveTab = (): Tab => {
    if (pathname.includes("/settings/account")) return "account";
    if (pathname.includes("/settings/privacy")) return "privacy";
    if (pathname.includes("/settings/billing")) return "billing";
    return "general";
  };

  const activeTab = getActiveTab();

  return (
    <section className="px-4 md:px-6 pt-16 text-gray-200">
      <h1 className="px-2 text-2xl text-gray-300 font-semibold mb-6 md:mb-8">
        Settings
      </h1>

      {/* Mobile Horizontal Navigation */}
      <nav className="md:hidden mb-6 overflow-x-auto">
        <div className="flex gap-2 min-w-max px-2">
          <Link
            href="/settings/general"
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "general"
                ? "bg-primary/70"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            General
          </Link>

          <Link
            href="/settings/account"
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "account"
                ? "bg-primary/70"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Account
          </Link>

          <Link
            href="/settings/privacy"
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "privacy"
                ? "bg-primary/70"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Privacy
          </Link>

          <Link
            href="/settings/billing"
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === "billing"
                ? "bg-primary/70"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Billing
          </Link>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Desktop Sidebar Navigation */}
        <nav className="hidden md:block w-56 space-y-1 sticky top-4 self-start shrink-0 text-lg">
          <div
            className={`px-3 py-2 rounded-lg cursor-pointer ${
              activeTab === "general" ? "bg-primary/70" : "hover:bg-gray-700"
            }`}
          >
            <Link href="/settings/general" className="flex">
              General
            </Link>
          </div>

          <div
            className={`px-3 py-2 rounded-lg cursor-pointer ${
              activeTab === "account" ? "bg-primary/70" : "hover:bg-gray-700"
            }`}
          >
            <Link href="/settings/account" className="flex">
              Account
            </Link>
          </div>

          <div
            className={`px-3 py-2 rounded-lg cursor-pointer ${
              activeTab === "privacy" ? "bg-primary/70" : "hover:bg-gray-700"
            }`}
          >
            <Link href="/settings/privacy" className="flex">
              Privacy
            </Link>
          </div>

          <div
            className={`px-3 py-2 rounded-lg cursor-pointer ${
              activeTab === "billing" ? "bg-primary/70" : "hover:bg-gray-700"
            }`}
          >
            <Link href="/settings/billing" className="flex">
              Billing
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </section>
  );
}
