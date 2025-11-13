'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/useGlobalContext';
import ContentSkeleton from '@/components/ContentSkeleton';
import DocumentIcon from '@/assets/Document';

interface HelpTopic {
  title: string;
  description: string;
  icon: string;
}

const HELP_TOPICS: HelpTopic[] = [
  {
    title: 'Getting Started',
    description:
      'Learn how to create, edit, and organize your notes. Start with the basics and explore all features.',
    icon: '📝',
  },
  {
    title: 'Keyboard Shortcuts',
    description:
      'Boost your productivity with keyboard shortcuts. Press Cmd/Ctrl + / to view all available shortcuts.',
    icon: '⌨️',
  },
  {
    title: 'Features',
    description:
      'Discover all the powerful features SnapNotes offers, from search to organization and collaboration.',
    icon: '✨',
  },
];

const FAQ = [
  {
    question: 'How do I create a new note?',
    answer:
      'Click the "+" button in the sidebar, use Ctrl+Alt+N (Windows) / Cmd+Option+N (Mac), or navigate to the Create Note page. Type your title and content, then save.',
  },
  {
    question: 'Can I pin important notes?',
    answer:
      'Yes! Click the pin icon on any note card to pin it. Pinned notes appear at the top of your notes list for quick access.',
  },
  {
    question: 'How do I search for notes?',
    answer:
      'Press Ctrl+K (Windows) / Cmd+K (Mac) to open the search. Type your query to find notes by title or content.',
  },
  {
    question: 'How can I save my note quickly?',
    answer:
      'While editing a note, press Ctrl+S (Windows) / Cmd+S (Mac) to save instantly without clicking the save button.',
  },
  {
    question: 'Are my notes synced across devices?',
    answer:
      "Yes! All your notes are stored in the cloud and sync automatically. You can access them from any device where you're logged in.",
  },
  {
    question: 'How do I delete a note?',
    answer:
      'Open the note and click the trash icon in the top right corner. Confirm the deletion in the dialog that appears.',
  },
];

export default function HelpPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = 'Help & Support | SnapNotes';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Get help with SnapNotes. Learn how to use all features, view keyboard shortcuts, and find answers to common questions.'
      );
  }, []);

  if (loading) return <ContentSkeleton lines={6} />;

  if (!user) return null;

  return (
    <div className="min-h-screen space-y-12 px-4 py-16 text-text-100 md:px-20">
      {/* Header */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold md:text-5xl">Help & Support</h1>
        <p className="max-w-2xl text-lg text-text-400">
          Get help with SnapNotes, explore features, and find answers to your
          questions.
        </p>
      </section>

      {/* Help Topics */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Quick Links</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HELP_TOPICS.map(topic => (
            <div
              key={topic.title}
              className="rounded-lg border border-border bg-bg-800 p-6 transition-all hover:bg-bg-700"
            >
              <div className="mb-3 text-3xl">{topic.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{topic.title}</h3>
              <p className="text-text-400">{topic.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl space-y-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-lg border border-border bg-bg-800 p-4 transition-colors hover:bg-bg-700"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-text-100">
                {item.question}
                <span className="ml-2 transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-text-400">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="rounded-lg border border-border bg-bg-800 p-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Can&apos;t find what you need?
        </h2>
        <p className="mb-6 text-text-400">
          If you have additional questions or need further assistance, feel free
          to reach out to our support team.
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-primary/90"
        >
          Contact Support
        </Link>
      </section>
    </div>
  );
}
