interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["50MB storage", "100 notes", "Basic features", "1 device sync"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "For individuals and power users",
    features: [
      "1GB storage",
      "Unlimited notes",
      "Advanced features",
      "Offline access",
      "5 device sync",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$19.99",
    description: "For teams and collaboration",
    features: [
      "5GB storage",
      "Unlimited notes",
      "Team collaboration",
      "10 members",
      "Priority support",
    ],
    cta: "Start Team Plan",
  },
];
