export type PlanName = 'free' | 'pro' | 'team';

// Wire format returned by the API — dates are ISO strings.
// Use Note (below) for app-level code after passing through mapNote().
export interface NoteDto {
  id: string;
  title: string;
  text: string;
  creator: string;
  updatedAt: string;
  pinnedAt: string | null;
}

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
