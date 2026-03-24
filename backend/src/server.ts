import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from '@/middlewares/cors';
import { authRouter } from '@/routes/auth';

const PORT = process.env.PORT || 3001;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware());
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});
