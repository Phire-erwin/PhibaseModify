
import request from 'supertest';
import { app } from '../../../app';

it('get application, should work', async () => {
  var response =await request(app)
    .post('/api/v1/common/applications')
    .send({ 
      name:'Application Test 1',
      
      props:{
        id: 'app',
        description:'this is sparta',
        keyRequired:true
      }
    })
    .expect(200);
    console.log('app data ',response.body.data)
  
  await request(app)
    .get('/api/v1/common/applications/'+response.body.data.application.id)
    .expect(200);
});

it('should return error if the data is not found', async () => {
  
  await request(app)
    .get('/api/v1/common/applications/yes')
    .expect(400);
});
