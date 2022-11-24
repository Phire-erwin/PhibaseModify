import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

const appName=process.env.APP_ID;

it('should fails when email invalid', async () => {
  
  const appName=process.env.APP_ID;
  
  await request(app)
    .post('/api/v1/common/auth/login')
    .send({
      email: 'test',
      password: 'password',
      app: appName
    })
    .expect(400);
});

it('should fails when password invalid', async () => {
  const appName=process.env.APP_ID;
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email: 'test@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: appName
      }
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

  await request(app)
    .post('/api/v1/common/auth/login')
    .send({
      email: 'test@test.com',
      password: 'wrongPassword',
      app: 'ABC-XYZ'
    })
    .expect(400);
});

it('should responds with a cookie when credential valid', async () => {
  const appName=process.env.APP_ID;
  await request(app)
    .post('/api/v1/common/applications')
    .send({ 
      name:appName,
      props: {
        id: appName
      }
    })
    .expect(200);
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email: 'testlogin@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: appName
      }
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

    const response = await request(app)
    .post('/api/v1/common/auth/login')
    .send({
      email: 'testlogin@test.com',
      password: 'password',
      app: appName
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(response.get('Set-Cookie')).toBeDefined();
});

it('should responds with a cookie when credential valid', async () => {
  const appName=process.env.APP_ID;
  await request(app)
    .post('/api/v1/common/applications')
    .send({ 
      name:appName,
      props: {
        id: appName
      }
    })
    .expect(200);
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email: 'test@test.com',
      password: 'password',
      name: 'test',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: appName
      }
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

    const response = await request(app)
    .post('/api/v1/common/auth/login')
    .send({
      email: 'test@test.com',
      password: 'password',
      app: appName
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  var cookie=(response.get('Set-Cookie'));
  expect(response.get('Set-Cookie')).toBeDefined();
  const curUser = await request(app)
    .get('/api/v1/common/auth/current-user')
    .set('Cookie', cookie)
    .expect(200);

    expect(curUser.body.email).toEqual('test@test.com');
    expect(curUser.body.role).toContain('Super Admin');
});
