import { prepareData } from '../../utils/prepared-data';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingModule } from '../../utils/create-testing-module';
import { RepositoryFactory } from '../../factories/repository.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let preparedData: { accessToken: string, refreshToken: string };
  let repositoryFactory: RepositoryFactory;
  beforeEach(async () => {
    const { generatedApp, repositoryFactory: rf } = await createTestingModule();
    app = generatedApp;
    repositoryFactory = rf;
    preparedData = await prepareData({ app });
  });

  it('Sign up should create a new user', async () => {
    return request(app.getHttpServer())
      .post('/v1/auth/sign-up')
      .send({ email: 'test2@test.com', password: 'test', name: 'Test2' })
      .expect(201);
  });

  afterAll(async () => {
    await repositoryFactory.cleanUpDatabase();
  });
});
