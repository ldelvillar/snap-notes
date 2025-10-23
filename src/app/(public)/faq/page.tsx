import Link from "next/link";
import Arrow from "@/assets/Arrow";

interface FAQ {
  category: string;
  questions: {
    q: string;
    a: string;
  }[];
}

const faqs: FAQ[] = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is Snap Notes?",
        a: "Snap Notes is a modern, cloud-based note-taking application designed to help you capture, organize, and access your thoughts, ideas, and information from anywhere. It syncs across all your devices seamlessly.",
      },
      {
        q: "How do I create an account?",
        a: "Visit our website and click 'Sign Up' or 'Get Started'. Enter your email address, create a secure password, and verify your email. Once verified, you can start creating notes immediately on the Free plan.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes! Our Free plan is completely free with 50MB storage. You can upgrade to Pro or Team plans anytime to unlock unlimited notes, more storage, and advanced features.",
      },
      {
        q: "Do I need a credit card to start?",
        a: "No. The Free plan requires no credit card. Only when you choose to upgrade to a paid plan (Pro or Team) will you be asked for payment information.",
      },
    ],
  },
  {
    category: "Features & Usage",
    questions: [
      {
        q: "Can I sync my notes across devices?",
        a: "Yes! With Snap Notes, your notes sync automatically across all your devices (web, iOS, Android). Access your notes anywhere, anytime with real-time synchronization.",
      },
      {
        q: "How much storage does each plan include?",
        a: "Free: 50MB, Pro: 1GB, Team: 5GB. Storage limits include all your notes, attachments, and files. You can see your usage in account settings.",
      },
      {
        q: "Can I share notes with others?",
        a: "Yes, with the Pro and Team plans. You can share individual notes or create collaborative notebooks where team members can edit and comment together.",
      },
      {
        q: "What file types can I attach?",
        a: "You can attach most common file types including images (JPG, PNG, GIF), documents (PDF, DOC), spreadsheets (XLS), and more. Check our help docs for the complete list.",
      },
      {
        q: "Is there an offline mode?",
        a: "Yes! Pro and Team plan members can work offline. Your notes will sync when you reconnect to the internet.",
      },
    ],
  },
  {
    category: "Pricing & Billing",
    questions: [
      {
        q: "Can I change my plan anytime?",
        a: "Absolutely. Upgrade or downgrade your plan anytime from your account settings. Changes take effect immediately, and we'll adjust your billing accordingly.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer refunds within 7 days of initial purchase if you're not satisfied. After 7 days, no refunds are provided, but you can cancel anytime with no lock-in contract.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit cards (Visa, Mastercard, American Express), PayPal, and other payment methods. All payments are processed securely through Stripe.",
      },
      {
        q: "Will my subscription auto-renew?",
        a: "Yes, subscriptions renew automatically on your billing date. You can cancel anytime in account settings, and we'll send you a reminder before renewal.",
      },
      {
        q: "Do you offer discounts for annual subscriptions?",
        a: "Yes! Annual subscriptions include a discount compared to monthly billing. You'll see the savings when you select 'Annual' during checkout.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    questions: [
      {
        q: "Is my data safe with Snap Notes?",
        a: "Your security is our priority. We use industry-standard encryption (AES-256) for data at rest and TLS/SSL for data in transit. All data is stored on secure, redundant servers.",
      },
      {
        q: "Do you encrypt my notes?",
        a: "Yes. Your notes are encrypted end-to-end. We cannot access your note content—only you and anyone you explicitly share with can read them.",
      },
      {
        q: "Can you read my notes?",
        a: "No. Your notes are encrypted, and Snap Notes employees have no access to your content. We only see metadata like your email and account information.",
      },
      {
        q: "How do you handle data breaches?",
        a: "We maintain strict security protocols and insurance. In the unlikely event of a breach, we'll notify affected users immediately and provide guidance on protecting your accounts.",
      },
      {
        q: "Do you sell my data?",
        a: "Absolutely not. We never sell, rent, or share your personal data with third parties for marketing purposes. Your data is yours alone.",
      },
    ],
  },
  {
    category: "Account Management",
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a secure link to reset your password.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. You can delete your account anytime in account settings. Your notes will be permanently deleted after a 30-day grace period, giving you time to export them if needed.",
      },
      {
        q: "Can I export my notes?",
        a: "Yes. You can export individual notes or your entire notebook in multiple formats (PDF, TXT, etc.) from your account settings.",
      },
      {
        q: "How do I enable two-factor authentication?",
        a: "In account settings, go to 'Security' and enable two-factor authentication. We support authenticator apps and SMS verification.",
      },
      {
        q: "What happens if I don't log in for a long time?",
        a: "Your account and notes remain safe. Accounts are never automatically deleted due to inactivity. You can log in anytime to access your notes.",
      },
    ],
  },
  {
    category: "Support & Troubleshooting",
    questions: [
      {
        q: "How do I contact support?",
        a: "You can reach our support team via email at support@snapnotes.io or through our contact form. We respond within 48 business hours.",
      },
      {
        q: "My notes aren't syncing. What should I do?",
        a: "First, check your internet connection. If you're still having issues, try logging out and back in. If the problem persists, contact support with your device details.",
      },
      {
        q: "The app keeps crashing. How can I fix it?",
        a: "Try uninstalling and reinstalling the app, or clear the app cache. Make sure you're running the latest version. If issues continue, contact our support team.",
      },
      {
        q: "Can I use Snap Notes offline?",
        a: "Free plan users are online-only. Pro and Team members can work offline—notes sync when reconnected. Plan to use Snap Notes offline? Consider upgrading!",
      },
      {
        q: "How do I report a bug?",
        a: "Use the 'Report Issue' feature in app settings, or email support@snapnotes.io with details about the bug, your device, and steps to reproduce it.",
      },
    ],
  },
  {
    category: "Team & Collaboration",
    questions: [
      {
        q: "What's included in the Team plan?",
        a: "The Team plan includes unlimited notes, 5GB storage, offline access, and team collaboration features. Invite up to 10 team members to collaborate on shared notebooks.",
      },
      {
        q: "How many people can join a team?",
        a: "The Team plan supports up to 10 members per workspace. Contact sales if you need a larger team size.",
      },
      {
        q: "Can team members see all my notes?",
        a: "No. By default, notes are private. You can share specific notebooks or notes with team members, controlling exactly who sees what.",
      },
      {
        q: "Is there a team admin dashboard?",
        a: "Yes. Team administrators can manage members, control permissions, set collaboration rules, and monitor team activity.",
      },
      {
        q: "Can I have multiple workspaces?",
        a: "Yes. Create separate workspaces for different projects or teams. Switch between workspaces easily within Snap Notes.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <section className="pt-32 pb-16 px-4 mx-auto max-w-4xl text-white animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-[#b09eb8]">
          Find answers to common questions about Snap Notes. Can&apos;t find
          what you&apos;re looking for?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              {section.category}
            </h2>

            <div className="space-y-2">
              {section.questions.map((item, qIdx) => (
                <details
                  key={qIdx}
                  className="group bg-[#241c26] border border-[#4d3d54] rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/50"
                >
                  <summary className="cursor-pointer px-6 py-4 flex items-center justify-between hover:bg-[#2a2230] transition-colors">
                    <span className="font-semibold text-[#e0e0e0] group-open:text-primary transition-colors">
                      {item.q}
                    </span>
                    <Arrow className="w-5 h-5 transition-transform duration-300 group-open:rotate-180 text-[#b09eb8]" />
                  </summary>

                  <div className="px-6 pb-4 border-t border-[#4d3d54] bg-[#1a1520]/50">
                    <p className="text-[#b09eb8] leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 pt-12 border-t border-[#4d3d54]">
        <div className="bg-linear-to-r from-primary/10 to-transparent rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-[#b09eb8] mb-6">
            Our support team is ready to help. Reach out to us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-primary font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              Contact Support
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-[#332938] font-bold rounded-lg hover:bg-[#3a303d] transition-all duration-300 border border-primary/30"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
