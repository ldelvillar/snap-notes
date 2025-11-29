'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cta from '@/components/landing/Cta';
import Tick from '@/assets/Tick';
import { PLANS } from '@/data/plans';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'What is Snap Notes?',
    answer:
      'Snap Notes is a note-taking application designed to help you capture and organize your thoughts, ideas, and information efficiently. It offers a range of features to enhance your productivity and creativity.',
  },
  {
    question: 'Can I access my notes offline?',
    answer:
      'Yes, Snap Notes offers offline access to your notes, allowing you to view and edit them without an internet connection.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, as well as PayPal.',
  },
];

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = 'Pricing Plans | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Explore Snap Notes pricing plans and choose the one that fits your needs. From free to premium options, find the perfect plan for you.'
      );
  }, []);

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="px-4 pt-32 pb-20">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <h1 className="text-4xl leading-tight font-bold md:text-5xl">
            Choose the plan that&apos;s right for you
          </h1>
          <p className="text-lg text-[#b09eb8]">
            Whether you&apos;re an individual or a team, Snap Notes has a plan
            to fit your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {PLANS.map((plan, idx) => (
            <div
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
                <Link
                  href="/register"
                  className={`mb-8 block w-full rounded-lg py-3 text-center font-bold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'border border-primary/20 bg-[#332938] text-white hover:bg-[#3a303d]'
                  }`}
                >
                  {plan.cta}
                </Link>

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
            </div>
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

      {/* FAQ Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-[#332938]"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-[#3a303d]"
                >
                  <span className="text-left font-medium">{faq.question}</span>
                  <svg
                    className={`size-5 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {expandedFaq === index && faq.answer && (
                  <div className="border-t border-[#4d3d54] px-6 py-4 text-[#b09eb8]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </div>
  );
}
