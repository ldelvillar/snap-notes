import { Resend } from 'resend';
import { env } from '@/lib/env';

const resend = new Resend(env.resendApiKey);

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const url = `${env.appUrl}/verify-email?token=${token}`;

  await resend.emails.send({
    from: `Snap Notes <noreply@${new URL(env.appUrl).hostname}>`,
    to,
    subject: 'Verify your email address',
    html: `<p>Click the link below to verify your email. It expires in 24 hours.</p><p><a href="${url}">${url}</a></p>`,
  });
}
