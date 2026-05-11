import { doubleCsrf } from 'csrf-csrf';
import { env } from '@/lib/env';

export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => env.csrfSecret,
  getSessionIdentifier: req =>
    (req.cookies as Record<string, string>)[env.cookieName] ?? '',
  cookieName: 'snapnotes_csrf',
  cookieOptions: {
    httpOnly: true,
    sameSite: env.isProduction ? 'none' : 'lax',
    secure: env.isProduction,
    path: '/',
  },
  skipCsrfProtection: req =>
    process.env.NODE_ENV === 'test' || req.path === '/payments/webhook',
});
