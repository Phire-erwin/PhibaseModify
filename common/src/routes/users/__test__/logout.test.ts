import request from 'supertest';
import { app } from '../../../app';

it('should clears the cookie after logout', async () => {
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
        app: 'ABC-XYZ'
      }
    })
    .expect(201);

  const response = await request(app)
    .post('/api/v1/common/auth/logout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
  );
});
