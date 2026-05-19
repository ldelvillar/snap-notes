'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/assets/Logo';
import { getCsrfToken } from '@/lib/csrf';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const csrfToken = await getCsrfToken();
      await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary">
            <Logo className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Reset your password</h1>
            <p className="mt-1 text-sm text-gray-400">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8">
          {submitted ? (
            <div className="text-center">
              <p className="text-sm text-gray-300">
                If that email is registered, a password reset link has been sent. Check your inbox.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block text-sm font-medium text-primary transition hover:text-primary/90"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending…
                  </span>
                ) : (
                  'Send reset link'
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                <Link href="/login" className="font-medium text-primary transition hover:text-primary/90">
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
