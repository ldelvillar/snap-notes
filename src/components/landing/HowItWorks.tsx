import Link from 'next/link';

interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Sign Up',
    description:
      'Create your free account in seconds. No credit card required. Just email and password.',
    icon: '✍️',
  },
  {
    number: '02',
    title: 'Start Taking Notes',
    description:
      'Begin capturing your thoughts, ideas, and information. Organize with tags and notebooks.',
    icon: '📝',
  },
  {
    number: '03',
    title: 'Sync Everywhere',
    description:
      'Your notes automatically sync across all your devices. Access them anytime, anywhere.',
    icon: '☁️',
  },
  {
    number: '04',
    title: 'Collaborate & Share',
    description:
      'Invite team members to shared notebooks. Work together in real-time with comments and edits.',
    icon: '🤝',
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl border-t border-[#4d3d54] px-4 py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
          How It Works
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#b09eb8]">
          Get started with Snap Notes in just 4 simple steps.
        </p>
      </div>

      {/* Steps Container */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="absolute top-24 left-full hidden h-0.5 w-8 bg-linear-to-r from-primary to-transparent lg:block" />
            )}

            {/* Card */}
            <div className="h-full rounded-lg border border-[#4d3d54] bg-[#1a1520] p-8 transition-all duration-300 hover:border-primary/50">
              {/* Step Number */}
              <div className="mb-4 text-5xl font-black text-primary/30">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4 text-4xl">{step.icon}</div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-bold text-white">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#b09eb8]">
                {step.description}
              </p>

              {/* Dot Indicator */}
              <div className="mt-6 flex gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="h-2 w-2 rounded-full bg-primary/50" />
                <div className="h-2 w-2 rounded-full bg-primary/30" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/pricing"
          className="inline-block transform rounded-lg bg-primary px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-primary/90"
        >
          Choose Your Plan
        </Link>
      </div>
    </section>
  );
}
