import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'email',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(400);
});

it('should returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'email',
      password: 'p',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(400);
});

it('should returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email: 'test@test.com',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(400);

  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(400);
});

it('should disallows duplicate emails', async () => {
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(400);
});

it('should sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

  expect(response.get('Set-Cookie')).toBeDefined();
});