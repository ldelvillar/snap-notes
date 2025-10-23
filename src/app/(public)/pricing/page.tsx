"use client";

import { useState } from "react";
import Link from "next/link";
import Cta from "@/components/Cta";

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["50MB storage", "100 notes", "Basic features", "1 device sync"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For individuals and power users",
    features: [
      "1GB storage",
      "Unlimited notes",
      "Advanced features",
      "Offline access",
      "5 device sync",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$19.99",
    description: "For teams and collaboration",
    features: [
      "5GB storage",
      "Unlimited notes",
      "Team collaboration",
      "10 members",
      "Priority support",
    ],
    cta: "Start Team Plan",
  },
];

const faqs: FAQ[] = [
  {
    question: "What is Snap Notes?",
    answer:
      "Snap Notes is a note-taking application designed to help you capture and organize your thoughts, ideas, and information efficiently. It offers a range of features to enhance your productivity and creativity.",
  },
  {
    question: "Can I access my notes offline?",
    answer:
      "Yes, Snap Notes offers offline access to your notes, allowing you to view and edit them without an internet connection.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, as well as PayPal.",
  },
];

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Choose the plan that&apos;s right for you
          </h1>
          <p className="text-lg text-[#b09eb8]">
            Whether you&apos;re an individual or a team, Snap Notes has a plan
            to fit your needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? "md:scale-105 border-2 border-primary shadow-2xl shadow-primary/30"
                  : "border border-[#4d3d54] hover:border-primary/50"
              } bg-[#241c26]`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-[#b09eb8] text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">
                    {plan.price}
                  </span>
                  <span className="text-[#b09eb8] ml-2">/month</span>
                </div>

                {/* CTA Button */}
                <Link
                  href="/register"
                  className={`block w-full py-3 rounded-lg font-bold text-center transition-all duration-300 mb-8 ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "bg-[#332938] hover:bg-[#3a303d] text-white border border-primary/20"
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center gap-3 text-[#b09eb8] text-sm"
                    >
                      <svg
                        className="w-5 h-5 text-primary shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#b09eb8] mb-4">
            Not sure which plan to pick?{" "}
            <Link
              href="/contact"
              className="text-primary hover:underline font-bold"
            >
              Talk to us
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#332938] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#3a303d] transition-colors"
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
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
                  <div className="px-6 py-4 border-t border-[#4d3d54] text-[#b09eb8]">
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
