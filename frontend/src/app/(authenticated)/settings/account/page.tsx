'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import LogoutConfirmation from '@/components/LogoutConfirmation';
import ContentSkeleton from '@/components/ContentSkeleton';
import { useAuth } from '@/context/useGlobalContext';

type ProfileField = {
  label: string;
  value: string | null;
  fullWidth?: boolean;
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

  if (loading) return <ContentSkeleton lines={3} />;

  if (!user) {
    router.push('/login');
    return null;
  }

  const profileFields: ProfileField[] = [
    { label: 'First Name', value: user.firstName },
    { label: 'Last Name', value: user.lastName },
    { label: 'Email', value: user.email, fullWidth: true },
    { label: 'Phone', value: user.phone, fullWidth: true },
  ];

  const subscription = user.subscription || 'free';
  const subscriptionLabel =
    subscription.charAt(0).toUpperCase() + subscription.slice(1);

  return (
    <>
      {confirmationOpen && (
        <LogoutConfirmation setConfirmationOpen={setConfirmationOpen} />
      )}

      <section className="max-w-4xl space-y-6">
        {/* Profile header */}
        <div className="rounded-lg border border-border p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="rounded-full border border-border p-1">
              <Image
                src={user.photo || '/images/nopicture.webp'}
                alt={`${user.firstName} ${user.lastName ?? ''}'s profile picture`}
                width={80}
                height={80}
                className="size-20 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-text-100">
                {user.firstName} {user.lastName ?? ''}
              </h1>
              <p className="mt-0.5 text-sm text-text-200">{user.email}</p>
              <span className="mt-2 inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {subscriptionLabel} plan
              </span>
            </div>
          </div>
        </div>

        {/* Personal information */}
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-text-100">
            Personal information
          </h2>
          <p className="mt-1 text-sm text-text-200">
            The details associated with your SnapNotes account.
          </p>

          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {profileFields.map(({ label, value, fullWidth }) => (
              <div
                key={label}
                className={`flex flex-col gap-1 ${fullWidth ? 'sm:col-span-2' : ''}`}
              >
                <dt className="text-xs font-medium tracking-wide text-text-200 uppercase">
                  {label}
                </dt>
                <dd className="text-sm text-text-100">
                  {value || (
                    <span className="text-text-200 italic">Not set</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Security */}
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-text-100">Security</h2>
          <p className="mt-1 text-sm text-text-200">
            Manage your password and account access.
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-text-100">Password</p>
              <p className="mt-0.5 text-xs text-text-200">
                We&apos;ll email you a secure link to set a new password.
              </p>
            </div>
            <Link
              href="/forgot-password"
              className="shrink-0 transform rounded-lg bg-bg-700 px-4 py-1.5 text-sm text-text-100 transition-colors hover:bg-bg-600 focus:ring-2 focus:ring-primary/50 focus:outline-none active:scale-95"
            >
              Reset password
            </Link>
          </div>
        </div>

        {/* Session */}
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-text-100">Session</h2>
          <p className="mt-1 text-sm text-text-200">
            Sign out of SnapNotes on this device.
          </p>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-text-100">Log out</p>
              <p className="mt-0.5 text-xs text-text-200">
                You&apos;ll need to sign in again to access your notes.
              </p>
            </div>
            <button
              onClick={() => setConfirmationOpen(true)}
              className="shrink-0 transform rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none active:scale-95"
            >
              Log out
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
