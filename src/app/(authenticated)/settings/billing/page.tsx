'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ContentSkeleton from '@/components/ContentSkeleton';
import Toast from '@/components/Toast';
import { useAuth } from '@/context/useGlobalContext';
import { PLANS } from '@/data/plans';
import { PlanName } from '@/types';

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get current plan from user's subscription
  const currentPlan: PlanName = user?.subscription?.plan || 'free';

  useEffect(() => {
    document.title = 'Billing & Subscription | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Manage your subscription and billing settings on SnapNotes'
      );
  }, []);

  const handleCancelSubscription = () => {
    setToastMessage('Subscription cancelled successfully');
    setShowToast(true);
  };

  const getPlanInfo = (plan: PlanName) => {
    const selectedPlan = PLANS.find(p => p.name === plan) || PLANS[0];

    return {
      name: selectedPlan.name,
      price:
        selectedPlan.price === '$0'
          ? '$0/month'
          : `${selectedPlan.price}/month`,
      features: selectedPlan.features,
    };
  };

  if (loading) return <ContentSkeleton lines={3} />;

  if (!user) {
    router.push('/login');
    return null;
  }

  const planInfo = getPlanInfo(currentPlan);

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-4xl space-y-6">
        {/* Current Plan */}
        <section className="rounded-lg border border-border">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-100">
              Current Plan
            </h2>
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-2 text-2xl font-bold text-text-100 capitalize">
                  {planInfo.name}
                </p>
                <p className="mb-4 text-xl text-primary">{planInfo.price}</p>
                <ul className="space-y-2">
                  {planInfo.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-text-300"
                    >
                      <svg
                        className="size-5 shrink-0 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/upgrade"
                  className="rounded-lg bg-primary px-4 py-2 text-center text-white transition-colors hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                >
                  {currentPlan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                </Link>
                {currentPlan !== 'free' && (
                  <button
                    onClick={handleCancelSubscription}
                    className="rounded-lg border border-red-400/50 px-4 py-2 text-red-400 transition-colors hover:bg-red-400/10 focus:ring-2 focus:ring-red-400/50 focus:outline-none"
                  >
                    Cancel Plan
                  </button>
                )}
              </div>
            </div>
            {currentPlan !== 'free' && user?.subscription?.currentPeriodEnd && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-sm text-gray-400">
                  Next billing date:{' '}
                  <span className="text-gray-200">
                    {new Date(
                      user.subscription.currentPeriodEnd instanceof Date
                        ? user.subscription.currentPeriodEnd
                        : user.subscription.currentPeriodEnd.toDate()
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
