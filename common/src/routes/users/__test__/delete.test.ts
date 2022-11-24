import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should returns a 204 on successfull delete user', async () => {
  const response = await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test1@test.com',
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

  // Login
  const cookie = await global.login();

  await request(app)
    .delete(`/api/v1/common/users/${response.body.user.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should returns a 404 with an invalid id', async () => {
  // Login
  const cookie = await global.login();

  const fakeId = '6195d4ec564f6c0018b15359';
  await request(app)
    .delete(`/api/v1/common/users/${fakeId}`)
    .set('Cookie', cookie)
    .send()
    .expect(404);
});