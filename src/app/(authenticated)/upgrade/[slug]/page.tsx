'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PaymentForm from '@/components/PaymentForm';
import ContentSkeleton from '@/components/ContentSkeleton';
import { useAuth } from '@/context/useGlobalContext';
import { PLANS } from '@/data/plans';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const VALID_SLUGS = ['pro', 'team'] as const;
type ValidSlug = (typeof VALID_SLUGS)[number];

const PLAN_AMOUNTS: Record<ValidSlug, number> = {
  pro: 999,
  team: 1999,
};

export default function UpgradePlanPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { user, loading } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate slug
  const isValidSlug = VALID_SLUGS.includes(slug as ValidSlug);
  const plan = PLANS.find(p => p.name === slug);

  useEffect(() => {
    if (!isValidSlug) return;

    const planName = slug.charAt(0).toUpperCase() + slug.slice(1);
    document.title = `Upgrade to ${planName} | SnapNotes`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Upgrade to SnapNotes ${planName} for enhanced features and more storage.`
      );
  }, [slug, isValidSlug]);

  useEffect(() => {
    if (!isValidSlug || !user) return;

    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: PLAN_AMOUNTS[slug as ValidSlug] }),
        });

        if (!response.ok) throw new Error('Failed to create payment intent');

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        setError('Unable to initialize payment. Please try again later.');
      }
    };

    fetchPaymentIntent();
  }, [user, slug, isValidSlug]);

  // Handle redirects in useEffect to avoid setState during render
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user?.subscription?.plan === slug) {
      router.push('/upgrade');
    }
  }, [loading, user, slug, router]);

  const planName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Return 404 for invalid slugs
  if (!isValidSlug || !plan) notFound();

  if (loading) return <ContentSkeleton lines={3} />;

  // Show nothing while redirecting
  if (!user || user?.subscription?.plan === slug) return null;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-border bg-bg-sidebar p-6">
          <div className="rounded-lg bg-bg-danger px-4 py-3 text-text-danger">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 text-white">
      <div className="mx-auto">
        <h1 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Upgrade to {planName}
        </h1>

        <div>
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#681083',
                    colorBackground: '#f5f4ed',
                    colorText: '#101828',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <div className="mx-auto w-full max-w-md">
                <div className="mb-6 rounded-xl border border-border bg-bg-sidebar p-5">
                  <h3 className="mb-3 text-lg font-semibold text-text-100">
                    Order details
                  </h3>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-text-300">{planName} plan</span>
                    <span className="font-medium text-text-100">
                      {plan.price}/month
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <span className="font-semibold text-text-100">Total</span>
                    <span className="text-xl font-bold text-text-100">
                      {plan.price}
                    </span>
                  </div>
                </div>

                <PaymentForm
                  planName={planName}
                  planPrice={plan.price}
                  onCancel={() => router.push('/upgrade')}
                />
              </div>
            </Elements>
          ) : (
            <div className="rounded-xl border border-border bg-bg-sidebar p-6">
              <div className="flex items-center justify-center py-12">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
