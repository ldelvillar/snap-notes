'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SettingsNavbarProps {
  children: React.ReactNode;
}

type Tab = 'general' | 'account' | 'privacy' | 'billing';

export default function SettingsNavbar({ children }: SettingsNavbarProps) {
  const pathname = usePathname();

  const getActiveTab = (): Tab => {
    if (pathname.includes('/settings/account')) return 'account';
    if (pathname.includes('/settings/privacy')) return 'privacy';
    if (pathname.includes('/settings/billing')) return 'billing';
    return 'general';
  };

  const activeTab = getActiveTab();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 text-text-200 md:px-8">
      <h1 className="mb-6 text-2xl font-semibold text-text-300 md:mb-8">
        Settings
      </h1>

      {/* Mobile Horizontal Navigation */}
      <nav className="mb-6 overflow-x-auto md:hidden">
        <div className="flex min-w-max gap-2">
          <Link
            href="/settings/general"
            className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
              activeTab === 'general' ? 'bg-bg-700' : 'hover:bg-bg-800'
            }`}
          >
            General
          </Link>

          <Link
            href="/settings/account"
            className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
              activeTab === 'account' ? 'bg-bg-700' : 'hover:bg-bg-800'
            }`}
          >
            Account
          </Link>

          <Link
            href="/settings/privacy"
            className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
              activeTab === 'privacy' ? 'bg-bg-700' : 'hover:bg-bg-800'
            }`}
          >
            Privacy
          </Link>

          <Link
            href="/settings/billing"
            className={`rounded-lg px-4 py-2 whitespace-nowrap transition-colors ${
              activeTab === 'billing' ? 'bg-bg-700' : 'hover:bg-bg-800'
            }`}
          >
            Billing
          </Link>
        </div>
      </nav>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Desktop Sidebar Navigation */}
        <nav className="sticky top-4 hidden w-56 shrink-0 space-y-1 self-start text-lg md:block">
          <div
            className={`cursor-pointer rounded-lg px-3 py-2 ${
              activeTab === 'general' ? 'bg-bg-700' : 'hover:bg-bg-800'
            }`}
          >
            <Link href="/settings/general" className="flex">
              General
            </Link>
          </div>

          <div
            className={`cursor-pointer rounded-lg px-3 py-2 ${
              activeTab === 'account' ? 'bg-bg-700' : 'hover:bg-bg-800'
            }`}
          >
            <Link href="/settings/account" className="flex">
              Account
            </Link>
          </div>

          <div
            className={`cursor-pointer rounded-lg px-3 py-2 ${
              activeTab === 'privacy' ? 'bg-bg-700' : 'hover:bg-bg-800'
            }`}
          >
            <Link href="/settings/privacy" className="flex">
              Privacy
            </Link>
          </div>

          <div
            className={`cursor-pointer rounded-lg px-3 py-2 ${
              activeTab === 'billing' ? 'bg-bg-700' : 'hover:bg-bg-800'
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
