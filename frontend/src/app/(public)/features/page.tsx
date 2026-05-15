import Image from 'next/image';
import Link from 'next/link';
import Cta from '@/components/landing/Cta';
import Tick from '@/assets/Tick';
import { FEATURES } from '@/data/features';

export const metadata = {
  title: 'Features | SnapNotes',
  description:
    'Discover the powerful features of Snap Notes that make note-taking effortless and secure. From seamless syncing to robust privacy, explore how Snap Notes can enhance your productivity.',
};

interface Highlight {
  title: string;
  description: string;
  items: string[];
  imgSrc: string;
}

const highlights: Highlight[] = [
  {
    title: 'Sync Across All Devices',
    description:
      'Start a note on your phone, continue on your tablet, finish on your desktop. All changes sync instantly without lifting a finger.',
    items: ['iOS', 'Android', 'Web', 'Mac', 'Windows'],
    imgSrc: '/images/cloud.avif',
  },
  {
    title: 'Your Privacy, Protected',
    description:
      'Military-grade encryption keeps your notes safe. We use the same security standards as banks and government agencies.',
    items: [
      'End-to-End AES-256 Encryption',
      'TLS/SSL in Transit',
      'Zero-Knowledge Architecture',
      'GDPR Compliant',
    ],
    imgSrc: '/images/lock.avif',
  },
  {
    title: 'Collaborate Seamlessly',
    description:
      'Share notebooks with your team. Comment on notes, see version history, and build together in real-time.',
    items: [
      'Real-Time Collaboration',
      'Commenting and Feedback',
      'Version History',
      'Role-Based Access Control',
    ],
    imgSrc: '/images/collaboration.avif',
  },
];

export default function FeaturesPage() {
  return (
    <div className="text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-36 pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary/12 blur-[120px]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
            Everything you need to take better notes
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/55">
            Snap Notes combines powerful note-taking with security and
            simplicity. Capture your thoughts, keep them safe, and access them
            anywhere.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
            >
              Get started →
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              All features
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Built for how you actually work
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-white/8 bg-white/3 p-7 transition-all duration-300 hover:border-primary/40 hover:bg-white/5"
              >
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-primary/15 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2.5 text-base font-semibold transition-colors group-hover:text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Deep dive
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              The details that make the difference
            </h2>
          </div>

          <div className="space-y-24">
            {highlights.map((highlight, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center gap-12 ${
                  idx % 2 !== 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Text */}
                <div className="flex-1">
                  <h2 className="mb-4 text-3xl font-bold">{highlight.title}</h2>
                  <p className="mb-7 text-lg text-white/55">
                    {highlight.description}
                  </p>
                  <ul className="space-y-3">
                    {highlight.items.map(item => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <Tick className="size-3" />
                        </span>
                        <span className="text-sm text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
                    <Image
                      src={highlight.imgSrc}
                      alt={`Illustration of ${highlight.title}`}
                      className="h-auto w-full"
                      width={500}
                      height={300}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta />
    </div>
  );
}
