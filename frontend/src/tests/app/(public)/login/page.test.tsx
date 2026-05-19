import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/(public)/login/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock('@/context/useGlobalContext', () => ({
  useAuth: () => ({ user: null, loading: false, refreshSession: vi.fn() }),
}));

vi.mock('@/lib/csrf', () => ({
  getCsrfToken: vi.fn().mockResolvedValue('test-token'),
}));

vi.mock('@/components/ContentSkeleton', () => ({
  default: () => <div>Loading</div>,
}));

interface FormOverrides {
  email?: string;
  password?: string;
}

async function fillAndSubmit(overrides: FormOverrides = {}) {
  const user = userEvent.setup();
  render(<LoginPage />);

  const { email = 'jane@example.com', password = 'password1' } = overrides;

  if (email) await user.type(screen.getByLabelText(/email address/i), email);
  if (password) await user.type(screen.getByLabelText(/password/i), password);

  fireEvent.submit(
    screen.getByRole('button', { name: /sign in/i }).closest('form')!
  );
}

describe('LoginPage — form validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error when email is missing', async () => {
    await fillAndSubmit({ email: '' });
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it('shows error when email format is invalid', async () => {
    await fillAndSubmit({ email: 'not-an-email' });
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });

  it('shows error when password is missing', async () => {
    await fillAndSubmit({ password: '' });
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    await fillAndSubmit({ password: 'abc' });
    expect(
      await screen.findByText(/at least 6 characters/i)
    ).toBeInTheDocument();
  });
});
