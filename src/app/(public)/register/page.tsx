'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import ErrorMessage from '@/components/ErrorMessage';
import { auth, db } from '@/config/firebase';
import { useAuth } from '@/context/useGlobalContext';
import ContentSkeleton from '@/components/ContentSkeleton';

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

const ERROR_MESSAGES: { [key: string]: string } = {
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
  'auth/weak-password': 'Password is too weak. Please use a stronger password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

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

  // Redirect after render to avoid updating Router during render
  useEffect(() => {
    if (user) router.push('/notes');
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim(),
    }));
    // Clear error when user starts typing
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

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          firstName: formData.fname,
          lastName: formData.lname,
          phone: formData.phone,
          photo: '',
          subscription: {
            plan: 'free',
            status: 'active',
          },
        });
      }
      router.push('/notes');
    } catch (err) {
      if (err instanceof FirebaseError) {
        const errorCode = err.code as string;
        setError(
          ERROR_MESSAGES[errorCode] || 'Failed to register. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <ContentSkeleton lines={3} />;

  if (user) return null;

  return (
    <section id="login" className="min-h-screen px-4 pt-20 pb-8 text-white">
      <h1 className="text-center text-4xl font-bold text-gray-100">
        Get started
      </h1>
      <p className="pt-1 text-center text-sm text-gray-200">
        by creating a free account
      </p>

      <form className="mx-auto mt-6 max-w-3xl" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative mb-3 flex flex-col">
            <label htmlFor="fname">First name*</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="border-b border-primary py-2 focus:outline-none"
              placeholder="First name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative mb-3 flex flex-col">
            <label htmlFor="lname">Last name*</label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              className="border-b border-primary py-2 focus:outline-none"
              placeholder="Last name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative mb-3 flex flex-col">
            <label htmlFor="phone">Phone number</label>
            <input
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border-b border-primary py-2 focus:outline-none"
              placeholder="Phone number"
              disabled={isLoading}
            />
          </div>
          <div className="relative mb-3 flex flex-col">
            <label htmlFor="email">Email address*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border-b border-primary py-2 focus:outline-none"
              placeholder="Your email"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative mb-3 flex flex-col">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border-b border-primary py-2 focus:outline-none"
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative mb-3 flex flex-col">
            <label htmlFor="repeat-password">Repeat Password*</label>
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="border-b border-primary py-2 focus:outline-none"
              placeholder="Repeat password"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <input
            type="checkbox"
            id="check"
            required
            onChange={handleChange}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
          <label
            htmlFor="check"
            className="cursor-pointer text-xs text-gray-600"
          >
            By checking the box you agree to our{' '}
            <Link
              href="/terms-of-service"
              className="text-primary hover:underline"
            >
              terms and conditions
            </Link>
            .
          </label>
        </div>
        {error && (
          <div className="mt-12 md:mx-20">
            <ErrorMessage message={error} />
          </div>
        )}
        <button
          type="submit"
          className="mt-10 w-full rounded-lg bg-primary px-4 py-2 text-lg font-semibold text-white hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
        <p className="mt-5 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-primary">
            Login here
          </Link>
        </p>
      </form>
    </section>
  );
}
