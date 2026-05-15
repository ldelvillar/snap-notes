'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Logo from '@/assets/Logo';
import EyeIcon from '@/assets/Eye';
import EyedClosedIcon from '@/assets/EyeClosed';
import { useAuth } from '@/context/useGlobalContext';
import ContentSkeleton from '@/components/ContentSkeleton';
import { getCsrfToken } from '@/lib/csrf';

interface SignupForm {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const INITIAL_FORM_STATE: SignupForm = {
  fname: '',
  lname: '',
  phone: '',
  email: '',
  password: '',
  repeatPassword: '',
};

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function RegisterPage() {
  useEffect(() => {
    document.title = 'Register | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Create a new account on Snap Notes to start taking and organizing your notes.'
      );
  }, []);

  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<SignupForm>(INITIAL_FORM_STATE);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  useEffect(() => {
    if (user) router.push('/notes');
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.fname || !formData.lname) {
      setError('First and last name are required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.phone && !formData.phone.match(/^\+?[\d\s-]{10,}$/)) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[a-zA-Z]/.test(formData.password)) {
      setError('Password must contain at least one letter');
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.fname,
          lastName: formData.lname,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message || 'Failed to register. Please try again.');
        return;
      }

      setRegistered(true);
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <ContentSkeleton lines={3} />;
  if (user) return null;

  if (registered) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary">
              <Logo className="size-6 text-white" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/10">
              <svg className="size-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Check your email</h1>
            <p className="mt-2 text-sm text-gray-400">
              We sent a verification link to{' '}
              <span className="font-medium text-gray-200">{formData.email}</span>.
              Click it to complete your registration.
            </p>
            <p className="mt-6 text-sm text-gray-500">
              Already verified?{' '}
              <Link href="/login" className="font-medium text-primary transition hover:text-primary/90">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary">
            <Logo className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-gray-400">Start taking notes for free</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8">
          {error && (
            <div className="mb-6 rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fname" className="mb-1 block text-sm font-medium text-gray-300">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fname"
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Jane"
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="lname" className="mb-1 block text-sm font-medium text-gray-300">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lname"
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-300">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-300">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  disabled={isLoading}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="8+ chars, 1 letter, 1 number"
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyedClosedIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="repeatPassword" className="mb-1 block text-sm font-medium text-gray-300">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="repeatPassword"
                    type={showRepeatPassword ? 'text' : 'password'}
                    name="repeatPassword"
                    value={formData.repeatPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    required
                    disabled={isLoading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showRepeatPassword ? <EyedClosedIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="check"
                required
                onChange={handleChange}
                className="mt-0.5 size-4 cursor-pointer rounded border-white/20 accent-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
              <label htmlFor="check" className="cursor-pointer text-xs text-gray-500">
                I agree to the{' '}
                <Link href="/terms-of-service" className="text-primary underline underline-offset-2 hover:text-primary/90">
                  terms and conditions
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary transition hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
