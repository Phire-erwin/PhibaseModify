
import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('delete item,should return success when deleting transaction', async () => {

  var resp= await request(app)
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
    .delete('/api/v1/common/items/'+resp.body.data.id)
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should return error if the data is not found', async () => {
  
  await request(app)
    .delete('/api/v1/common/items/asddds')
    .expect(400);
});

it('delete item(component ) used in a BOM,should return error', async () => {

  var resp= await request(app)
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
  var bom =await request(app)
  .post('/api/v1/common/boms')
  .send({ 
    name:'BOM A',
    domain:['manufacture'],
    app:'common-test',
    props:{
      components:[
        {
          id:resp.body.data.id,
          quantity:2
        },
        {
          name:'NEW COMPONENT',
          quantity:10
        }
      ],
      stock:1,
      price:100,
      cost:50,
    }
  })
  .expect(200);
  console.log(bom.body.data.props)
  var components=bom.body.data.props.components;

  await request(app)
    .delete('/api/v1/common/items/'+resp.body.data.id)
    .expect(400);
});