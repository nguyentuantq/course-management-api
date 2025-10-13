import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('/users/register', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({ name: 'Stu', email: 'stu@example.com', password: 'secret12', role: 'student' })
      .expect(201);
  });

  it('/auth/login', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'stu@example.com', password: 'secret12' })
      .expect(201)
      .expect(({ body }) => {
        if (!body.data || !body.data.accessToken) throw new Error('No accessToken in response');
      });
  });
});
