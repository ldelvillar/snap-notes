import 'dotenv/config';
import { env } from '@/lib/env';
import { app } from '@/app';
import { logger } from '@/lib/logger';

app.listen(env.port, () => {
  logger.info(`listening on http://localhost:${env.port}`);
});
