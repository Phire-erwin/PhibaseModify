import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';



it('create then update single bom, should return success if the item was added with props', async () => {
  //create component(item)
  var component =await request(app)
    .post('/api/v1/common/items')
    .send({ 
      name:'yes',
      domain:['manufacture'],
      app:'common-test',
      props:{
        id: 'rm',
        stock:1,
        price:100,
        cost:50,
      }
    })
    .expect(200);
  
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

  

  console.log(component.body.data);
  expect(component.body.data.app).toEqual('common-test')
  //create bom with created component and new component
  var bom =await request(app)
  .post('/api/v1/common/boms')
  .send({ 
    name:'BOM A',
    domain:['manufacture'],
    app:'common-test',
    props:{
      components:[
        {
          id:component.body.data.id,
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
  expect(components).toHaveLength(2);
  
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);

  
  
  bom = await request(app)
  .put('/api/v1/common/boms/'+bom.body.data.id)
  .send({ 
    name:'BOM A',
    domain:['manufacture'],
    app:'common-test',
    props:{
      components:[
        {
          id:components[0].id,
          quantity:23
        },
        {
          name:'YET NEW COMPONENT',
          quantity:12
        }
      ],
      stock:1,
      price:100,
      cost:50,
    }
  })
  .expect(200);
  
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(5);

  

  components=bom.body.data.props.components;
  expect(components[0].id).toBeDefined();
  expect(components[0].name).toEqual('yes');
  expect(components[0].quantity).toEqual(23);
  expect(components[1].name).toEqual('YET NEW COMPONENT');

  var items=await request(app)
    .get('/api/v1/common/items')
    .expect(200);

  expect(items.body.data).toHaveLength(4);

});
