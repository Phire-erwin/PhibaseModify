import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should get all users by query', async () => {
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test1@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Admin'
      },
      props: {
        app: 'ABC-XYZ'
      }
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

  // Login
  const cookie = await global.login();

  // Get all users by query
  const response = await request(app)
    .get('/api/v1/common/users/by/?role=Admin')
    .set('Cookie', cookie)
    .send()
    .expect(200);
    expect(response.body.length).toEqual(1);
});