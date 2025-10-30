import { useState } from "react";
import Link from "next/link";

import LogoutConfirmation from "@/components/LogoutConfirmation";
import SettingsIcon from "@/assets/Settings";
import HelpIcon from "@/assets/Help";
import RoundedArrow from "@/assets/RoundedArrow";
import InfoIcon from "@/assets/Info";
import HalfArrow from "@/assets/HalfArrow";
import LogoutIcon from "@/assets/Logout";
import DocumentIcon from "@/assets/Document";
import { User } from "@/types";

interface AccountMenuProps {
  user: User;
}

export default function AccountMenu({ user }: AccountMenuProps) {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <nav className="p-2 w-64 absolute bottom-16 left-2 z-50 text-sm text-gray-200 bg-[#353535] rounded-lg border border-[#585858] shadow-lg">
      <p className="px-2 pb-2 pt-1 text-gray-400">{user.email}</p>

      <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-700">
        <Link href="/settings" className="flex items-center gap-2">
          <SettingsIcon className="size-4" />
          Settings
        </Link>
      </div>

      <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-700">
        <Link href="/help" className="flex items-center gap-2">
          <HelpIcon className="size-4" />
          Get help
        </Link>
      </div>

      <hr className="my-1 border-gray-600" />

      <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-700">
        <Link href="/upgrade" className="flex items-center gap-2">
          <RoundedArrow className="size-4" />
          Upgrade plan
        </Link>
      </div>

      <div
        className="p-2 relative rounded-lg cursor-pointer hover:bg-gray-700"
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
          <div className="absolute left-full top-0 -ml-2 pl-3 w-48">
            <div className="p-2 text-sm text-gray-200 bg-[#353535] rounded-lg border border-[#585858] shadow-lg">
              <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-700">
                <Link
                  href="/privacy-policy"
                  className="flex items-center gap-2"
                >
                  <DocumentIcon className="size-4" />
                  Privacy Policy
                </Link>
              </div>

              <div className="p-2 rounded-lg cursor-pointer hover:bg-gray-700">
                <Link
                  href="/terms-of-service"
                  className="flex items-center gap-2"
                >
                  <DocumentIcon className="size-4" />
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-1 border-gray-600" />

      <div className="p-2 cursor-pointer rounded-lg hover:bg-gray-700">
        <button
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-2"
        >
          <LogoutIcon className="size-4" />
          Log out
        </button>
      </div>
      {logoutOpen && <LogoutConfirmation setConfirmationOpen={setLogoutOpen} />}
    </nav>
  );
}
