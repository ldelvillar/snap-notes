import Link from 'next/link';
import { FEATURES } from '@/data/features';

export default function FeaturesHighlight() {
  return (
    <section className="px-4 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Why Choose Snap Notes?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/50">
            Everything you need to capture, organize, and share your thoughts
            securely.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.slice(0, 4).map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-white/8 bg-white/3 p-7 transition-all duration-300 hover:border-primary/40 hover:bg-white/5"
            >
              {/* Icon */}
              <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-primary/15 text-2xl">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2.5 text-base font-semibold transition-colors group-hover:text-primary">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-white/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/40 px-7 py-3 text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary/10"
          >
            Explore all features →
          </Link>
        </div>
      </div>
    </section>
  );
}
