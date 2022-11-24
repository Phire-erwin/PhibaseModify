
import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('delete application,should return success when deleting transaction', async () => {

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

  var applications=await request(app)
    .get('/api/v1/common/applications')
    .expect(200);

  expect(applications.body.data).toHaveLength(1)
  
  await request(app)
    .delete('/api/v1/common/applications/'+response.body.data.application.id)
    .expect(200);

    applications=await request(app)
    .get('/api/v1/common/applications')
    .expect(200);

  expect(applications.body.data).toHaveLength(0)
});
