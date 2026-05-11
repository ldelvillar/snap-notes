'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/useGlobalContext';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Verify Email | SnapNotes';
  }, []);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('No verification token found. Please check your email link.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;
          setError(data?.message || 'Verification failed. Please try again.');
          return;
        }

        await refreshSession();
        router.push('/notes');
      } catch {
        setError('An unexpected error occurred. Please try again.');
      }
    };

    verify();
  }, [searchParams, refreshSession, router]);

  if (error) {
    return (
      <section className="min-h-screen px-4 pt-20 pb-8 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-100">
            Verification failed
          </h1>
          <p className="mt-4 text-gray-300">{error}</p>
          <Link
            href="/login"
            className="mt-8 inline-block text-primary transition-colors hover:text-primary/90"
          >
            Back to login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 pt-20 pb-8 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-100">
          Verifying your email&hellip;
        </h1>
        <div className="mt-6 flex justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"
            role="status"
            aria-label="Verifying"
          />
        </div>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
