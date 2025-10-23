import { FEATURES } from "@/data/features";

export default function FeaturesHighlight() {
  return (
    <section className="py-20 px-4 mx-auto max-w-6-xl">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Why Choose Snap Notes?
        </h2>
        <p className="text-lg text-[#b09eb8] max-w-2xl mx-auto">
          Everything you need to capture, organize, and share your thoughts
          securely.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.slice(0, 4).map((feature, idx) => (
          <div
            key={idx}
            className="group bg-[#241c26] border border-[#4d3d54] rounded-lg p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
          >
            {/* Icon */}
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-[#b09eb8] leading-relaxed text-sm">
              {feature.description}
            </p>

            {/* Accent Line */}
            <div className="mt-4 h-1 w-0 bg-primary group-hover:w-full transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <a
          href="/features"
          className="inline-block px-8 py-3 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-bold"
        >
          Explore All Features →
        </a>
      </div>
    </section>
  );
}
