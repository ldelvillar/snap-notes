import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'https://snap-notes.vercel.app',
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    credentials: true,
    origin: (origin: string, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  });
