import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd && !isTest;

export const logger = pino({
  level: isTest ? 'silent' : isDev ? 'debug' : 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
  redact: ['req.headers.cookie', 'req.headers.authorization'],
});
