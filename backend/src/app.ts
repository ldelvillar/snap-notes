import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from '@/middlewares/cors';
import { authRouter } from '@/routes/auth';
import { healthRouter } from '@/routes/health';
import { notesRouter } from '@/routes/notes';
import { paymentsRouter } from '@/routes/payments';

export const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.use('/auth', authRouter);
app.use('/health', healthRouter);
app.use('/notes', notesRouter);
app.use('/payments', paymentsRouter);
