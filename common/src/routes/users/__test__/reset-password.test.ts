import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should returns a 200 on successfull reset password', async () => {
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

  const response = await request(app)
    .post('/api/v1/common/auth/forgot-password')
    .send({
      email: 'test@test.com',
      app: 'ABC-XYZ'
    })
    .expect(201);

  await request(app)
    .put(`/api/v1/common/auth/reset-password/${response.body.token}`)
    .send({
      newPassword: '123456'
    })
    .expect(200);
});