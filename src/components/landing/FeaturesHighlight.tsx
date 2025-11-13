import Link from 'next/link';
import { FEATURES } from '@/data/features';

export default function FeaturesHighlight() {
  return (
    <section className="max-w-6-xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
          Why Choose Snap Notes?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#b09eb8]">
          Everything you need to capture, organize, and share your thoughts
          securely.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.slice(0, 4).map((feature, idx) => (
          <div
            key={idx}
            className="group cursor-pointer rounded-lg border border-[#4d3d54] bg-[#241c26] p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
          >
            {/* Icon */}
            <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-primary">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-[#b09eb8]">
              {feature.description}
            </p>

            {/* Accent Line */}
            <div className="mt-4 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/features"
          className="inline-block rounded-lg border-2 border-primary px-8 py-3 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
        >
          Explore All Features →
        </Link>
      </div>
    </section>
  );
}
