'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import LogoutConfirmation from '@/components/LogoutConfirmation';
import ContentSkeleton from '@/components/ContentSkeleton';
import { useAuth } from '@/context/useGlobalContext';

type ProfileField = {
  label: string;
  value: string;
};

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = 'Your Account | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', 'Manage your account settings on SnapNotes');
  }, []);

  const profileFields: ProfileField[] = user
    ? [
        { label: 'First Name', value: user.firstName },
        { label: 'Last Name', value: user.lastName },
        { label: 'Email', value: user.email },
      ]
    : [];

  if (loading) return <ContentSkeleton lines={3} />;

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <>
      {/* Confirmation Dialog */}
      {confirmationOpen && (
        <LogoutConfirmation setConfirmationOpen={setConfirmationOpen} />
      )}

      {/* Main Content */}
      <section className="max-w-4xl rounded-lg border border-border">
        <div className="p-6">
          {/* Profile Information */}
          <div className="w-full space-y-4 rounded-lg">
            <div className="inline-block rounded-lg border border-border p-2">
              <Image
                src={user?.photo || '/images/nopicture.webp'}
                alt={`${user.firstName} ${user.lastName}'s profile picture`}
                width={100}
                height={100}
                className="size-10 rounded-full"
              />
            </div>
            {profileFields.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <p className="font-medium text-text-100">{label}</p>
                <p className="text-sm text-text-200">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex w-full items-center justify-between pt-4">
            <p>Log out from this device</p>
            <button
              onClick={() => setConfirmationOpen(true)}
              className="transform rounded-lg bg-primary px-4 py-1 text-white transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none active:scale-95"
            >
              Log out
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
