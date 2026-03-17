import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { createLogger, initObservability } from '@qhph/observability';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = createLogger('api');
  const obs = initObservability('api');
  logger.info('observability initialized', obs);

  process.env.DATABASE_URL =
    process.env.DATABASE_URL || 'postgresql://qhph:qhph@localhost:5432/qhph?schema=public';

  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '0.0.0.0';

  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.setGlobalPrefix('api/v1');
  await app.listen(port, host);
  logger.info('api started', { port, host });
}

bootstrap().catch((error) => {
  const logger = createLogger('api');
  logger.error('api bootstrap error', { error: String(error) });
  process.exit(1);
});
