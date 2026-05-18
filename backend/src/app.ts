import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { corsMiddleware } from '@/middlewares/cors';
import { buildOpenApiDocument } from '@/lib/openapi';
import { doubleCsrfProtection } from '@/lib/csrf';
import { logger } from '@/lib/logger';
import { authRouter } from '@/routes/auth';
import { healthRouter } from '@/routes/health';
import { notesRouter } from '@/routes/notes';
import { paymentsRouter } from '@/routes/payments';

export const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: req => req.url === '/health' },
  })
);
app.use('/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.use(doubleCsrfProtection);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(buildOpenApiDocument()));
app.use('/auth', authRouter);
app.use('/health', healthRouter);
app.use('/notes', notesRouter);
app.use('/payments', paymentsRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ message: 'Internal server error' });
});
