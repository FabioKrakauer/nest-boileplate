import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupAdminJs } from './lib/adminjs/setup-adminjs';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupAdminJs(app);

  app.useGlobalPipes(new ValidationPipe());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
