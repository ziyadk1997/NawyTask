import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import spec from './infrastructure/http/swagger';
import { createApartmentsRouter } from './interfaces/controllers/apartments.controller';
import prisma from './infrastructure/db/prisma.service';
import { errorHandler } from './middlewares/error.handler';

const requiredEnv = ['DATABASE_URL'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

async function bootstrap() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/v1/apartments', createApartmentsRouter());

  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));

  // Global error handler
  app.use(errorHandler);

  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => logger.info({ port }, 'Backend listening'));

  // graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down');
    await prisma.$disconnect();
    process.exit(0);
  });
}

bootstrap().catch(err => {
  console.error(err);
  process.exit(1);
});
