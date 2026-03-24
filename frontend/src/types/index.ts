export type PlanName = 'free' | 'pro' | 'team';

export interface Note {
  id: string;
  title: string;
  text: string;
  creator: string;
  updatedAt: Date;
  pinnedAt: Date | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  photo: string | null;
  subscription: PlanName | null;
  createdAt: string;
  updatedAt: string;
}
