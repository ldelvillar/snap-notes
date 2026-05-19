'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/assets/Logo';
import EyeIcon from '@/assets/Eye';
import EyedClosedIcon from '@/assets/EyeClosed';
import { getCsrfToken } from '@/lib/csrf';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(
        'Missing reset token. Please request a new password reset link.'
      );
    }
  }, [token]);

  const validate = (): boolean => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setError('Password must contain at least one letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError(
        'Missing reset token. Please request a new password reset link.'
      );
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      });

      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        setError(
          data?.message ||
            'Failed to reset password. The link may have expired.'
        );
        return;
      }

      router.push('/login?reset=1');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-gray-300"
        >
          New password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="8+ chars, 1 letter, 1 number"
            disabled={isSubmitting || !token}
            autoComplete="new-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition hover:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyedClosedIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="repeat-password"
          className="mb-1.5 block text-sm font-medium text-gray-300"
        >
          Confirm new password
        </label>
        <input
          id="repeat-password"
          type={showPassword ? 'text' : 'password'}
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          placeholder="Repeat password"
          disabled={isSubmitting || !token}
          autoComplete="new-password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !token}
        className="mt-2 w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Resetting…
          </span>
        ) : (
          'Reset password'
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        <Link
          href="/login"
          className="font-medium text-primary transition hover:text-primary/90"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary">
            <Logo className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              Set a new password
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Choose a strong password for your account
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
