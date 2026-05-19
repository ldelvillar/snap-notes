'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import ContentSkeleton from '@/components/ContentSkeleton';
import EyeIcon from '@/assets/Eye';
import EyedClosedIcon from '@/assets/EyeClosed';
import Logo from '@/assets/Logo';
import { useAuth } from '@/context/useGlobalContext';
import { getCsrfToken } from '@/lib/csrf';

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordReset = searchParams.get('reset') === '1';
  const { user, loading, refreshSession } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>(
    'idle'
  );
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  useEffect(() => {
    document.title = 'Login | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Log in to your Snap Notes account to access your notes.'
      );
  }, []);

  useEffect(() => {
    if (user) router.push('/notes');
  }, [user, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setError(null);
  };

  const handleResend = async () => {
    setResendStatus('sending');
    try {
      const csrfToken = await getCsrfToken();
      await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });
    } finally {
      setResendStatus('sent');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        setError(data?.message || 'Failed to login. Please try again.');
        setShowResend(response.status === 403);
        setFormData(prev => ({ ...prev, password: '' }));
        return;
      }

      await refreshSession();
      router.push('/notes');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <ContentSkeleton lines={3} />;
  if (user) return null;

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary">
            <Logo className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-400">
              Sign in to your SnapNotes account
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8">
          {passwordReset && (
            <div className="mb-6 rounded-lg border border-green-800/50 bg-green-900/20 px-4 py-3 text-sm text-green-400">
              Password reset successfully. You can now sign in with your new
              password.
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
              <p>{error}</p>
              {showResend && (
                <div className="mt-2">
                  {resendStatus === 'sent' ? (
                    <p className="text-green-400">
                      Verification email sent — check your inbox.
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendStatus === 'sending'}
                      className="font-medium text-red-300 underline underline-offset-2 hover:text-red-200 disabled:opacity-50"
                    >
                      {resendStatus === 'sending'
                        ? 'Sending…'
                        : 'Resend verification email'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
                className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:ring-2 focus:outline-none disabled:opacity-50 ${
                  errors.email
                    ? 'border-red-700 focus:border-red-600 focus:ring-red-900/50'
                    : 'border-white/10 focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 transition focus:ring-2 focus:outline-none disabled:opacity-50 ${
                    errors.password
                      ? 'border-red-700 focus:border-red-600 focus:ring-red-900/50'
                      : 'border-white/10 focus:border-primary focus:ring-primary/20'
                  }`}
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
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
              <div className="mt-1 text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-500 transition hover:text-gray-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary transition hover:text-primary/90"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
