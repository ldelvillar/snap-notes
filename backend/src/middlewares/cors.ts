import cors from 'cors';
import { env } from '@/lib/env';

export const corsMiddleware = ({ acceptedOrigins = env.allowedOrigins } = {}) =>
  cors({
    credentials: true,
    origin: (origin: string, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  });
