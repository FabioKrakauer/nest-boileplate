import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { RepositoryFactory } from '../factories/repository.factory';

export async function createTestingModule({
  extraControllers,
}: {
  extraControllers?: any[];
} = {}) {
  const testingModuleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    controllers: extraControllers ?? [],
  }).compile();

  const generatedApp =
    testingModuleRef.createNestApplication<NestExpressApplication>();


  generatedApp.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  generatedApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
    }),
  );

  const repositoryFactory = new RepositoryFactory(testingModuleRef);

  await generatedApp.init();

  return { generatedApp, testingModuleRef, repositoryFactory };
}