import request from 'supertest';
import { app } from '../../../app';

it('should responds with current user details', async () => {
  const cookie = await global.login();

  const response = await request(app)
    .get('/api/v1/common/auth/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.email).toEqual('test@test.com');
});

it('should responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/v1/common/auth/current-user')
    .send()
    .expect(200);

  expect(response.body).toBeNull;
});
