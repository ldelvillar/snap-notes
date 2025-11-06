"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LogoutConfirmation from "@/components/LogoutConfirmation";
import ContentSkeleton from "@/components/ContentSkeleton";
import { useAuth } from "@/context/useGlobalContext";

type ProfileField = {
  label: string;
  value: string;
};

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = "Your Account | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Manage your account settings on SnapNotes");
  }, []);

  const profileFields: ProfileField[] = user
    ? [
        { label: "First Name", value: user.firstName },
        { label: "Last Name", value: user.lastName },
        { label: "Email", value: user.email },
      ]
    : [];

  if (loading) {
    return (
      <div className="mt-12 mx-10 md:mx-20">
        <ContentSkeleton lines={3} />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      {/* Confirmation Dialog */}
      {confirmationOpen && (
        <LogoutConfirmation setConfirmationOpen={setConfirmationOpen} />
      )}

      {/* Main Content */}
      <section className="mx-2 max-w-4xl rounded-lg border border-border">
        <div className="p-6">
          {/* Profile Information */}
          <div className="w-full space-y-4 rounded-lg">
            <div className="p-2 rounded-lg border border-border inline-block">
              <Image
                src={user?.photo || "/images/nopicture.webp"}
                alt={`${user.firstName} ${user.lastName}'s profile picture`}
                width={100}
                height={100}
                className="size-10 rounded-full"
              />
            </div>
            {profileFields.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <p className="text-text-100 font-medium">{label}</p>
                <p className="text-text-200 text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-4 w-full flex items-center justify-between">
            <p>Log out from this device</p>
            <button
              onClick={() => setConfirmationOpen(true)}
              className="px-4 py-1 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95 transform"
            >
              Log out
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
