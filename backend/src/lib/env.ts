function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  jwtSecret: requireEnv('AUTH_JWT_SECRET'),
  csrfSecret: requireEnv('CSRF_SECRET'),
  stripeSecretKey: requireEnv('STRIPE_SECRET_KEY'),
  webhookSecret: requireEnv('STRIPE_WEBHOOK_SECRET'),
  resendApiKey: requireEnv('RESEND_API_KEY'),
  appUrl: requireEnv('APP_URL'),
  emailFrom: requireEnv('EMAIL_FROM'),
  cookieName: process.env.AUTH_COOKIE_NAME || 'snapnotes_session',
  port: process.env.PORT || '3001',
  allowedOrigins: (
    process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000'
  ).split(','),
  isProduction: process.env.NODE_ENV === 'production',
};
