import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';



it('should return success if the item was added with props', async () => {
  
  await request(app)
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
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should return success if the item was added without props', async () => {
  
  await request(app)
    .post('/api/v1/common/items')
    .send({ 
      name:'yes',
      domain:['distribution'],
      app:'wryyy',
      props: {
        id: 'rm2'
      }
    })
    .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should an error if the item was added with incomplete data', async () => {
  
  await request(app)
    .post('/api/v1/common/items')
    .send({ name:'yes'
      })
    .expect(400);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(0);
});