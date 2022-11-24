import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should create new user', async () => {
  // Login
  const cookie = await global.login();

  // Create user
  await request(app)
    .post('/api/v1/common/users')
    .set('Cookie', cookie)
    .send({
      email: 'posttest@test.com',
      password: '123456',
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