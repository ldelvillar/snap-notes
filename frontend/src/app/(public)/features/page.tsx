import Image from 'next/image';
import Link from 'next/link';
import Cta from '@/components/landing/Cta';
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
      {/* Hero Section */}
      <section className="px-4 pt-32 pb-16">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-5xl leading-tight font-bold md:text-6xl">
            Everything you need to take better notes
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-[#b09eb8]">
            Snap Notes combines powerful note-taking with security and
            simplicity. Capture your thoughts, keep them safe, and access them
            anywhere.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/pricing"
              className="transform rounded-lg bg-primary px-8 py-4 font-bold transition-all duration-300 hover:scale-105 hover:bg-primary/90"
            >
              Get Started
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-primary/30 bg-[#332938] px-8 py-4 font-bold transition-all duration-300 hover:bg-[#3a303d]"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-lg border border-[#4d3d54] bg-[#241c26] p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h2 className="mb-3 text-xl font-bold text-[#e0e0e0] transition-colors group-hover:text-primary">
                  {feature.title}
                </h2>
                <p className="leading-relaxed text-[#b09eb8]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl space-y-16">
          {highlights.map((highlight, idx) => (
            <div
              className={`flex flex-col ${
                idx % 2 != 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-12`}
              key={idx}
            >
              <div className="md:basis-1/2">
                <h2 className="mb-4 text-3xl font-bold">{highlight.title}</h2>
                <p className="mb-6 text-lg text-[#b09eb8]">
                  {highlight.description}
                </p>
                <ul className="space-y-1">
                  {highlight.items.map(item => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[#b09eb8]"
                    >
                      <span className="text-xl text-primary">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:basis-1/2">
                <Image
                  src={highlight.imgSrc}
                  alt={`Illustration of ${highlight.title}`}
                  className="h-auto w-full rounded-lg"
                  width={500}
                  height={300}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Cta />
    </div>
  );
}
