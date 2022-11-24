import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';



it('should return success if the application was added with props', async () => {
  var appName = process.env.APP_ID;
  //to test appID rule
  var response =await request(app)
    .post('/api/v1/common/applications')
    .send({ 
      name:'pHiRESUITE tEsT',
      
      props:{
        id: 'phiresuite',
        description:'this is sparta',
        keyRequired:true
      }
    })
    .expect(200);

    console.log('create application ',response.body.data);
    expect(response.body.data.application.appID).toEqual('phiresuite-test');
    expect(response.body.data.email).toEqual('superadmin@phiresuite.com');

    //login with correct credential
    await request(app)
    .post('/api/v1/common/auth/login')
    .send({
      email: response.body.data.email,
      password: response.body.data.password,
      app: response.body.data.application.appID
    })
    .expect(200);

    //login with false app id
    await request(app)
    .post('/api/v1/common/auth/login')
    .send({
      email: response.body.data.email,
      password: response.body.data.password,
      app: 'wat'
    })
    .expect(400);

    
});

it('should return success if the application was added without props', async () => {
  var appName = process.env.APP_ID;
  await request(app)
    .post('/api/v1/common/applications')
    .send({ 
      name:appName,
      props: {
        id: appName
      }
    })
    .expect(200);
    
});