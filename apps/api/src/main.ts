import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Local-dev static hosting for uploaded files (when Storj env is not configured)
  app.use('/uploads', express.static('/tmp/easystream-uploads'));

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
}
bootstrap();
