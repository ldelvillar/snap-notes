import { Timestamp } from 'firebase/firestore';

export type PlanName = 'free' | 'pro' | 'team';

export interface Note {
  id: string;
  title: string;
  text: string;
  creator: string;
  updatedAt: Date;
  pinnedAt: Date | null;
}

export interface Subscription {
  plan: PlanName;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd?: Date | Timestamp;
  cancelAtPeriodEnd?: boolean;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photo?: string;
  uid: string;
  subscription: Subscription;
}
