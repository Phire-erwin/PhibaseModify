import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('should ack the message', async () => {
  var itemID:any=null;
  
  var response= await request(app)
  .post('/api/v1/common/items')
  .send({ 
    name:'yes',
    domain:['common'],
    app:'wryyy',
    props:{
      id: 'id',
      stock:5,
      price:100,
      cost:50,

    }
    })
  .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  itemID=response.body.data.id;

  expect(response.body.data.props.stock).toEqual(5)

  jest.clearAllMocks();

  expect(natsWrapper.client.publish).not.toHaveBeenCalled();

  var { msg, data, listener } = await global.emulateItemStockChangeEvent([
    {
      itemID:itemID,
      quantity:-2
    }
  ]);

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
  jest.clearAllMocks();

  var item =await request(app)
  .get('/api/v1/common/items/'+itemID)
  .expect(200);

  expect(item.body.data.props.stock).toEqual(3)


  var event2=await global.emulateItemStockChangeEvent([
    {
      itemID:itemID,
      quantity:9
    }
  ]);

  await listener.onMessage(event2.data, event2.msg);

  expect(event2.msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  var item =await request(app)
  .get('/api/v1/common/items/'+itemID)
  .expect(200);

  expect(item.body.data.props.stock).toEqual(12)
});
