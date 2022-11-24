import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should delete all users by query', async () => {
  var appName= process.env.APP_ID
  // Register 1st user
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test1@test.com',
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

  // Register 2nd user
  await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test2@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Customer'
      },
      props: {
        app: appName
      }
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

  // Login
  const cookie = await global.login();

  // Delete all users with role Customer
  await request(app)
    .delete('/api/v1/common/users/by/?role=Customer')
    .set('Cookie', cookie)
    .send()
    .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

  // Get all users
  const response = await request(app)
    .get('/api/v1/common/users/'+appName)
    .set('Cookie', cookie)
    .send()
    .expect(200);
    expect(response.body.length).toEqual(2);
});