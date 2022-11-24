import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should returns a 200 on successfull update password', async () => {
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
    .put('/api/v1/common/auth/update-password')
    .send({
      email           : 'test@test.com',
      currentPassword : 'password',
      newPassword     : '123456'
    })
    .expect(200);
});

it('should returns a 400 on an invalid email', async () => {
  await request(app)
    .put('/api/v1/common/auth/update-password')
    .send({
      email           : 'test',
      currentPassword : 'password',
      newPassword     : '123456'
    })
    .expect(400);
});

it('should returns a 400 on missing email / current password / new password', async () => {
  await request(app)
    .put('/api/v1/common/auth/update-password')
    .send({
      currentPassword : 'password',
      newPassword     : '123456'
    })
    .expect(400);

  await request(app)
    .put('/api/v1/common/auth/update-password')
    .send({
      email       : 'test@test.com',
      newPassword : '123456'
    })
    .expect(400);

  await request(app)
    .put('/api/v1/common/auth/update-password')
    .send({
      email           : 'test@test.com',
      currentPassword : 'password'
    })
    .expect(400);
});

it('should returns a 400 with an unregistered email', async () => {
  await request(app)
    .put('/api/v1/common/auth/update-password')
    .send({
      email: 'test123@test.com'
    })
    .expect(400);
});