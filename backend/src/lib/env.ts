function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  jwtSecret: requireEnv('AUTH_JWT_SECRET'),
  stripeSecretKey: requireEnv('STRIPE_SECRET_KEY'),
  webhookSecret: requireEnv('STRIPE_WEBHOOK_SECRET'),
  cookieName: process.env.AUTH_COOKIE_NAME || 'snapnotes_session',
  port: process.env.PORT || '3001',
  allowedOrigins: (
    process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000'
  ).split(','),
  isProduction: process.env.NODE_ENV === 'production',
};
