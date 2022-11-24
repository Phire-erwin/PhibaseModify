
import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('udpate item, should work', async () => {
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
  
  var updated=await request(app)
    .put('/api/v1/common/items/'+resp.body.data.id)
    .send({name:'yessss', app:'wryyy', props: {id: 'rm' }})
    .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

  expect(updated.body.data.name).toEqual('yessss')
});

it('should return error if the data is not found', async () => {
  
  await request(app)
    .put('/api/v1/common/items/yes')
    .send({name:'yes'})
    .expect(400);
});