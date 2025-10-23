"use client";

import { useAuth } from "@/context/useGlobalContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ContentSkeleton from "@/components/ContentSkeleton";
import { useState } from "react";

type ProfileField = {
  label: string;
  value: string;
};

export default function AccountPage() {
  const { user, loading, handleLogout } = useAuth();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const router = useRouter();

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
        <ContentSkeleton lines={3} className="max-w-xl" />
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <p className="text-center text-lg font-medium mb-4">
              Do you really want to logout?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setConfirmationOpen(false)}
                className="bg-white hover:bg-gray-100 transition-colors 
                                rounded-full px-6 py-2.5 text-lg text-black border border-black 
                                font-semibold focus:outline-none focus:ring-2 
                                focus:ring-gray-100 active:scale-95 transform"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="bg-primary hover:bg-primary/90 transition-colors 
                                rounded-full px-6 py-2.5 text-lg text-white 
                                font-semibold focus:outline-none focus:ring-2 
                                focus:ring-primary/50 active:scale-95 transform"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
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
