import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import { FEATURES } from "@/data/features";

interface Highlight {
  title: string;
  description: string;
  items: string[];
  imgSrc: string;
}

const highlights: Highlight[] = [
  {
    title: "Sync Across All Devices",
    description:
      "Start a note on your phone, continue on your tablet, finish on your desktop. All changes sync instantly without lifting a finger.",
    items: ["iOS", "Android", "Web", "Mac", "Windows"],
    imgSrc: "/images/cloud.avif",
  },
  {
    title: "Your Privacy, Protected",
    description:
      "Military-grade encryption keeps your notes safe. We use the same security standards as banks and government agencies.",
    items: [
      "End-to-End AES-256 Encryption",
      "TLS/SSL in Transit",
      "Zero-Knowledge Architecture",
      "GDPR Compliant",
    ],
    imgSrc: "/images/lock.avif",
  },
  {
    title: "Collaborate Seamlessly",
    description:
      "Share notebooks with your team. Comment on notes, see version history, and build together in real-time.",
    items: [
      "Real-Time Collaboration",
      "Commenting and Feedback",
      "Version History",
      "Role-Based Access Control",
    ],
    imgSrc: "/images/collaboration.avif",
  },
];

export default function FeaturesPage() {
  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Everything you need to take better notes
          </h1>
          <p className="text-xl text-[#b09eb8] max-w-2xl mx-auto">
            Snap Notes combines powerful note-taking with security and
            simplicity. Capture your thoughts, keep them safe, and access them
            anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/pricing"
              className="px-8 py-4 bg-primary font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/faq"
              className="px-8 py-4 bg-[#332938] font-bold rounded-lg hover:bg-[#3a303d] transition-all duration-300 border border-primary/30"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-[#241c26] border border-[#4d3d54] rounded-lg p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#e0e0e0] group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#b09eb8] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {highlights.map((highlight, idx) => (
            <div
              className={`flex flex-col ${
                idx % 2 != 0 ? "md:flex-row" : "md:flex-row-reverse"
              } gap-12`}
              key={idx}
            >
              <div className="md:basis-1/2">
                <h2 className="text-3xl font-bold mb-4">{highlight.title}</h2>
                <p className="text-[#b09eb8] text-lg mb-6">
                  {highlight.description}
                </p>
                <ul className="space-y-1">
                  {highlight.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[#b09eb8]"
                    >
                      <span className="text-primary text-xl">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:basis-1/2">
                <Image
                  src={highlight.imgSrc}
                  alt="Feature Highlight"
                  className="w-full h-auto rounded-lg"
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
