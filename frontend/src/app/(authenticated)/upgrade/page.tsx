'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/context/useGlobalContext';
import ContentSkeleton from '@/components/ContentSkeleton';
import Tick from '@/assets/Tick';
import { PLANS } from '@/data/plans';

export default function UpgradePage() {
  useEffect(() => {
    document.title = 'Upgrade Plan | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Explore Snap Notes pricing plans and choose the one that fits your needs. From free to premium options, find the perfect plan for you.'
      );
  }, []);

  const { user, loading } = useAuth();

  if (loading) return <ContentSkeleton lines={3} />;

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="px-4 pt-16 pb-20">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-4xl leading-tight font-bold">
            Choose the plan that&apos;s right for you
          </h1>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan, idx) => (
            <article
              key={idx}
              className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-primary shadow-2xl shadow-primary/30 md:scale-105'
                  : 'border border-[#4d3d54] hover:border-primary/50'
              } bg-[#241c26]`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <span className="rounded-full bg-primary px-4 py-1 text-sm font-bold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="mb-2 text-2xl font-bold text-white capitalize">
                  {plan.name}
                </h3>
                <p className="mb-6 text-sm text-[#b09eb8]">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-[#b09eb8]">/month</span>
                </div>

                {/* CTA Button */}
                {user?.subscription?.plan === plan.name ? (
                  <button
                    className="mb-8 w-full cursor-not-allowed rounded-lg bg-bg-600 py-3 text-center font-bold text-text-300"
                    disabled
                  >
                    Current Plan
                  </button>
                ) : (
                  <Link
                    href={plan.href}
                    className={`mb-8 block w-full rounded-lg py-3 text-center font-bold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'border border-primary/20 bg-[#332938] text-white hover:bg-[#3a303d]'
                    }`}
                  >
                    {user?.subscription?.plan === 'team'
                      ? `Downgrade to ${plan.name}`
                      : plan.cta}
                  </Link>
                )}

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-3 text-sm text-[#b09eb8]"
                    >
                      <Tick className="size-5 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="mb-4 text-[#b09eb8]">
            Not sure which plan to pick?{' '}
            <Link
              href="/contact"
              className="font-bold text-primary hover:underline"
            >
              Talk to us
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
