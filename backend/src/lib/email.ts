import { Resend } from 'resend';
import { env } from '@/lib/env';

const resend = new Resend(env.resendApiKey);

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const url = `${env.appUrl}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: env.emailFrom,
    to,
    subject: 'Verify your email address',
    html: `<p>Click the link below to verify your email. It expires in 24 hours.</p><p><a href="${url}">${url}</a></p>`,
  });

  if (error) throw error;
}

export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const url = `${env.appUrl}/reset-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: env.emailFrom,
    to,
    subject: 'Reset your SnapNotes password',
    html: `<p>Click the link below to reset your password. It expires in 1 hour.</p><p><a href="${url}">${url}</a></p><p>If you did not request a password reset, you can safely ignore this email.</p>`,
  });

  if (error) throw error;
}
