import { useState } from 'react';
import Link from 'next/link';

import LogoutConfirmation from '@/components/LogoutConfirmation';
import SettingsIcon from '@/assets/Settings';
import HelpIcon from '@/assets/Help';
import RoundedArrow from '@/assets/RoundedArrow';
import InfoIcon from '@/assets/Info';
import HalfArrow from '@/assets/HalfArrow';
import LogoutIcon from '@/assets/Logout';
import DocumentIcon from '@/assets/Document';
import KeyboardIcon from '@/assets/Keyboard';
import { User } from '@/types';
interface AccountMenuProps {
  user: User;
  setAccountMenuOpen: (open: boolean) => void;
  setIsMobileOpen: (open: boolean) => void;
  setShortcutsOpen: (open: boolean) => void;
}

export default function AccountMenu({
  user,
  setAccountMenuOpen,
  setIsMobileOpen,
  setShortcutsOpen,
}: AccountMenuProps) {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <nav className="absolute bottom-16 left-2 z-50 w-64 rounded-lg border border-border bg-bg-menu p-2 text-sm text-text-300 shadow-lg">
      <p className="px-2 pt-1 pb-2 text-text-400">{user.email}</p>

      <div className="cursor-pointer rounded-lg p-2 hover:bg-bg-700">
        <Link
          href="/settings"
          className="flex items-center gap-2"
          onClick={() => {
            setAccountMenuOpen(false);
            setIsMobileOpen(false);
          }}
        >
          <SettingsIcon className="size-4" />
          Settings
        </Link>
      </div>

      <div
        className="relative cursor-pointer rounded-lg p-2 hover:bg-bg-700"
        onMouseEnter={() => setHelpOpen(true)}
        onMouseLeave={() => setHelpOpen(false)}
      >
        <div className="flex items-center gap-2">
          <HelpIcon className="size-4" />
          Help
          <HalfArrow className="ml-auto size-4" />
        </div>

        {/* Submenu */}
        {helpOpen && (
          <div className="absolute top-0 left-full -ml-2 w-56 pl-3">
            <div className="rounded-lg border border-border bg-bg-menu p-2 text-sm text-text-200 shadow-lg">
              <div className="cursor-pointer rounded-lg p-2 hover:bg-bg-700">
                <button
                  onClick={() => setShortcutsOpen(true)}
                  className="flex items-center gap-2"
                >
                  <KeyboardIcon className="size-4" />
                  Keyboard shortcuts
                </button>
              </div>

              <div className="cursor-pointer rounded-lg p-2 hover:bg-bg-700">
                <Link href="/help" className="flex items-center gap-2">
                  <HelpIcon className="size-4" />
                  Help center
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-1 border-bg-600" />

      <div className="cursor-pointer rounded-lg p-2 hover:bg-bg-700">
        <Link
          href="/upgrade"
          className="flex items-center gap-2"
          onClick={() => {
            setAccountMenuOpen(false);
            setIsMobileOpen(false);
          }}
        >
          <RoundedArrow className="size-4" />
          Upgrade plan
        </Link>
      </div>

      <div
        className="relative cursor-pointer rounded-lg p-2 hover:bg-bg-700"
        onMouseEnter={() => setLearnMoreOpen(true)}
        onMouseLeave={() => setLearnMoreOpen(false)}
      >
        <div className="flex items-center gap-2">
          <InfoIcon className="size-4" />
          Learn more
          <HalfArrow className="ml-auto size-4" />
        </div>

        {/* Submenu */}
        {learnMoreOpen && (
          <div className="absolute top-0 left-full -ml-2 w-48 pl-3">
            <div className="rounded-lg border border-border bg-bg-menu p-2 text-sm text-text-200 shadow-lg">
              <div className="cursor-pointer rounded-lg p-2 hover:bg-bg-700">
                <Link
                  href="/privacy-policy"
                  className="flex items-center gap-2"
                >
                  <DocumentIcon className="size-4" />
                  Privacy policy
                </Link>
              </div>

              <div className="cursor-pointer rounded-lg p-2 hover:bg-bg-700">
                <Link
                  href="/terms-of-service"
                  className="flex items-center gap-2"
                >
                  <DocumentIcon className="size-4" />
                  Terms of service
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-1 border-bg-600" />

      <div className="cursor-pointer rounded-lg p-2 hover:bg-bg-700">
        <button
          onClick={() => setLogoutOpen(true)}
          className="flex w-full items-center gap-2"
        >
          <LogoutIcon className="size-4" />
          Log out
        </button>
      </div>
      {logoutOpen && <LogoutConfirmation setConfirmationOpen={setLogoutOpen} />}
    </nav>
  );
}
