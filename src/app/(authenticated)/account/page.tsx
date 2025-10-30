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
        { label: "Email", value: user.email },
        { label: "First Name", value: user.firstName },
        { label: "Last Name", value: user.lastName },
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
      <section className="p-12 md:px-20">
        <div className="flex flex-col items-start gap-6 max-w-4xl">
          {/* Profile Header */}
          <div className="flex items-center gap-4 w-full">
            <div className="size-16 shrink-0">
              <Image
                src={user.photo || "/images/nopicture.webp"}
                width={64}
                height={64}
                alt="Profile picture"
                className="rounded-full object-cover w-full h-full"
                priority
              />
            </div>
            <h1 className="text-3xl text-gray-200 font-bold">
              Welcome Back, {user.firstName}
            </h1>
          </div>

          {/* Profile Information */}
          <div className="w-full space-y-4 bg-gray-50 rounded-lg p-6">
            {profileFields.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="text-sm text-gray-500 font-medium">{label}</dt>
                <dd className="text-base font-medium">{value}</dd>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="w-full pt-4">
            <button
              onClick={() => setConfirmationOpen(true)}
              className="bg-primary hover:bg-primary/90 transition-colors 
                            rounded-full px-6 py-2.5 text-lg text-white 
                            font-semibold focus:outline-none focus:ring-2 
                            focus:ring-primary/50 active:scale-95 transform"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
