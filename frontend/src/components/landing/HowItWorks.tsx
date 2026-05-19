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
    <section className="px-4 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            How it works
          </p>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Up and running in minutes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/50">
            Get started with Snap Notes in just 4 simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute top-6 left-[calc(50%+24px)] hidden h-px w-[calc(100%-48px)] bg-linear-to-r from-primary/40 to-transparent lg:block" />
              )}

              <div className="rounded-2xl border border-white/8 bg-white/3 p-7 transition-all duration-300 hover:border-primary/40 hover:bg-white/5">
                {/* Step circle */}
                <div className="mb-5 flex size-11 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-bold text-primary">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4 text-3xl">{step.icon}</div>

                {/* Title */}
                <h3 className="mb-2.5 text-base font-semibold">{step.title}</h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-white/50">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
          >
            Choose your plan →
          </Link>
        </div>
      </div>
    </section>
  );
}
