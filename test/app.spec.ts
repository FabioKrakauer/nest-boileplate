import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createTestingModule } from './utils/create-testing-module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const { generatedApp } = await createTestingModule();
    app = generatedApp;
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1')
      .expect(200)
      .expect('Hello World!');
  });
});
