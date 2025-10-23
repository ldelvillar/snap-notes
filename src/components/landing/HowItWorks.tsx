interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your free account in seconds. No credit card required. Just email and password.",
    icon: "✍️",
  },
  {
    number: "02",
    title: "Start Taking Notes",
    description:
      "Begin capturing your thoughts, ideas, and information. Organize with tags and notebooks.",
    icon: "📝",
  },
  {
    number: "03",
    title: "Sync Everywhere",
    description:
      "Your notes automatically sync across all your devices. Access them anytime, anywhere.",
    icon: "☁️",
  },
  {
    number: "04",
    title: "Collaborate & Share",
    description:
      "Invite team members to shared notebooks. Work together in real-time with comments and edits.",
    icon: "🤝",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 mx-auto max-w-6xl border-t border-[#4d3d54]">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          How It Works
        </h2>
        <p className="text-lg text-[#b09eb8] max-w-2xl mx-auto">
          Get started with Snap Notes in just 4 simple steps.
        </p>
      </div>

      {/* Steps Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute top-24 left-full w-8 h-0.5 bg-linear-to-r from-primary to-transparent" />
            )}

            {/* Card */}
            <div className="bg-[#1a1520] border border-[#4d3d54] rounded-lg p-8 hover:border-primary/50 transition-all duration-300 h-full">
              {/* Step Number */}
              <div className="text-5xl font-black text-primary/30 mb-4">
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4">{step.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-[#b09eb8] text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Dot Indicator */}
              <div className="mt-6 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary/50" />
                <div className="w-2 h-2 rounded-full bg-primary/30" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <a
          href="/pricing"
          className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
        >
          Choose Your Plan
        </a>
      </div>
    </section>
  );
}
