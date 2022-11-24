
import request from 'supertest';
import { app } from '../../../app';

it('get item, should work', async () => {
  var resp=await request(app)
    .post('/api/v1/common/items')
    .send({ 
      name:'yes',
      domain:['distribution'],
      app:'wryyy',
      props:{
        id: 'rm',
        stock:1,
        price:100,
        cost:50,
    }
  })
  .expect(200);
  
  await request(app)
    .get('/api/v1/common/items/'+resp.body.data.id)
    .expect(200);
});

it('should return error if the data is not found', async () => {
  
  await request(app)
    .get('/api/v1/common/items/yes')
    .expect(400);
});
