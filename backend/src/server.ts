import 'dotenv/config';
import { env } from '@/lib/env';
import { app } from '@/app';

app.listen(env.port, () => {
  console.log(`Example app listening on port http://localhost:${env.port}`);
});
