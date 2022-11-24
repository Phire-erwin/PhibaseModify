import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should returns a 200 on successfull activation', async () => {
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

  await request(app)
    .put(`/api/v1/common/auth/activate/${response.body.user.id}`)
    .send()
    .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should returns a 404 with an invalid id', async () => {
  const fakeId = '6195d4ec564f6c0018b15359';
  await request(app)
    .put(`/api/v1/common/auth/activate/${fakeId}`)
    .send()
    .expect(404);
});