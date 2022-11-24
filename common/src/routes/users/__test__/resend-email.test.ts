import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should returns a 201 on successfull resend email', async () => {
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
    .post('/api/v1/common/auth/resend-email')
    .send({
      email: 'test@test.com'
    })
    .expect(201);
});

it('should returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/v1/common/auth/resend-email')
    .send({
      email: 'test'
    })
    .expect(400);
});

it('should returns a 400 with an unregistered email', async () => {
  await request(app)
    .post('/api/v1/common/auth/resend-email')
    .send({
      email: 'test123@test.com'
    })
    .expect(400);
});