import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('generate and verify 2fa secret', async () => {
  var appName = process.env.APP_ID;
  /*
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
        app: app
      }
    })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  */
  // Login
  const cookie = await global.login();

  const response = await request(app)
    .get('/api/v1/common/auth/current-user')
    .set('Cookie', cookie)
    .expect(200);

  console.log('response ',response.body)
  

  // Error validate send
  await request(app)
  .post(`/api/v1/common/validate/2fa/${response.body.id}`)
  .send({})
  .set('Cookie', cookie)
  .expect(400);

  // Update user
  const responseAfterGenerate = await request(app)
    .post(`/api/v1/common/generate/2fa/${response.body.id}`)
    .set('Cookie', cookie)
    .expect(200);
  
  expect(responseAfterGenerate.body.secret.secret).toBeDefined();
  expect(responseAfterGenerate.body.secret.uri).toBeDefined();
  expect(responseAfterGenerate.body.secret.qr).toBeDefined();
  expect(responseAfterGenerate.body.currentToken).toBeDefined();

  var curToken=responseAfterGenerate.body.currentToken.token

  //test user 2fa secret
  

  const userData=await request(app)
  .get(`/api/v1/common/user-by-id/${response.body.id}`)
  .set('Cookie', cookie)
  .send()
  .expect(200);

  console.log(userData.body);
  expect(userData.body.props.secret2fa).toEqual(responseAfterGenerate.body.secret.secret)

  var responseAfterValidate= await request(app)
  .post(`/api/v1/common/validate/2fa/${response.body.id}`)
  .send({code2fa:curToken})
  .set('Cookie', cookie)
  .expect(200);

  responseAfterValidate= await request(app)
  .post(`/api/v1/common/validate/2fa/${response.body.id}`)
  .send({code2fa:'111111'})
  .set('Cookie', cookie)
  .expect(400);
});