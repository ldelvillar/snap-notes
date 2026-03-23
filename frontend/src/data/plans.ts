import { PlanName } from '@/types';

interface Plan {
  name: PlanName;
  price: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: 'free',
    price: '0€',
    description: 'Perfect for getting started',
    features: ['50MB storage', '100 notes', 'Basic features', '1 device sync'],
    href: '/register',
    cta: 'Get started',
  },
  {
    name: 'pro',
    price: '9.99€',
    description: 'For individuals and power users',
    features: [
      '1GB storage',
      'Unlimited notes',
      'Advanced features',
      'Offline access',
      '5 device sync',
    ],
    cta: 'Upgrade to Pro',
    href: '/upgrade/pro',
    popular: true,
  },
  {
    name: 'team',
    price: '19.99€',
    description: 'For teams and collaboration',
    features: [
      '5GB storage',
      'Unlimited notes',
      'Team collaboration',
      '10 members',
      'Priority support',
    ],
    href: '/upgrade/team',
    cta: 'Get Team',
  },
];
