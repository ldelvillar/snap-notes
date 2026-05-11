import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from '@/middlewares/cors';
import { buildOpenApiDocument } from '@/lib/openapi';
import { authRouter } from '@/routes/auth';
import { healthRouter } from '@/routes/health';
import { notesRouter } from '@/routes/notes';
import { paymentsRouter } from '@/routes/payments';

export const app = express();

app.disable('x-powered-by');
app.use('/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(buildOpenApiDocument()));
app.use('/auth', authRouter);
app.use('/health', healthRouter);
app.use('/notes', notesRouter);
app.use('/payments', paymentsRouter);
