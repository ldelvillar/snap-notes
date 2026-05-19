import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/(public)/register/page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
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
  useAuth: () => ({ user: null, loading: false }),
}));

vi.mock('@/lib/csrf', () => ({
  getCsrfToken: vi.fn().mockResolvedValue('test-token'),
}));

vi.mock('@/components/ContentSkeleton', () => ({
  default: () => <div>Loading</div>,
}));

interface FormOverrides {
  fname?: string;
  lname?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  skipCheckbox?: boolean;
}

async function fillAndSubmit(overrides: FormOverrides = {}) {
  const user = userEvent.setup();
  render(<RegisterPage />);

  const {
    fname = 'Jane',
    lname = 'Doe',
    email = 'jane@example.com',
    password = 'Password1',
    repeatPassword = password,
    skipCheckbox = false,
  } = overrides;

  if (fname) await user.type(screen.getByLabelText(/first name/i), fname);
  if (lname) await user.type(screen.getByLabelText(/last name/i), lname);
  if (email) await user.type(screen.getByLabelText(/email address/i), email);
  if (password)
    await user.type(screen.getByPlaceholderText(/8\+ chars/i), password);
  if (repeatPassword)
    await user.type(
      screen.getByPlaceholderText(/repeat password/i),
      repeatPassword
    );
  if (!skipCheckbox) await user.click(screen.getByRole('checkbox'));

  fireEvent.submit(
    screen.getByRole('button', { name: /create account/i }).closest('form')!
  );
}

describe('RegisterPage — form validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows error when first name is missing', async () => {
    await fillAndSubmit({ fname: '', lname: 'Doe' });
    expect(
      await screen.findByText(/first and last name are required/i)
    ).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    await fillAndSubmit({ password: 'Abc1', repeatPassword: 'Abc1' });
    expect(
      await screen.findByText(/at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it('shows error when password has no letter', async () => {
    await fillAndSubmit({ password: '12345678', repeatPassword: '12345678' });
    expect(await screen.findByText(/at least one letter/i)).toBeInTheDocument();
  });

  it('shows error when password has no number', async () => {
    await fillAndSubmit({ password: 'abcdefgh', repeatPassword: 'abcdefgh' });
    expect(await screen.findByText(/at least one number/i)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    await fillAndSubmit({ password: 'Password1', repeatPassword: 'Password2' });
    expect(await screen.findByText(/do not match/i)).toBeInTheDocument();
  });
});
