import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';



it('create single bom, should return success if the item was added with props', async () => {
  //create component(item)
  var component =await request(app)
    .post('/api/v1/common/items')
    .send({ 
      name:'yes',
      domain:['manufacture'],
      app:'common-test',
      props:{
        id: 'item',
        stock:1,
        price:100,
        cost:50,
      }
    })
    .expect(200);

  console.log(component.body.data);
  expect(component.body.data.app).toEqual('common-test')
  
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

  
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
  
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);
  
  console.log(bom.body.data.props)
  var components=bom.body.data.props.components;
  expect(components).toHaveLength(2);
  expect(components[0].id).toBeDefined();
  expect(components[0].name).toEqual('yes')
  expect(components[1].name).toEqual('NEW COMPONENT')

  var items=await request(app)
    .get('/api/v1/common/items')
    .expect(200);

  expect(items.body.data).toHaveLength(3);

});

it('create single bom with invalid component, should return error', async () => {
  
  //create bom with invalid id
  var bom =await request(app)
  .post('/api/v1/common/boms')
  .send({ 
    name:'BOM A',
    domain:['manufacture'],
    app:'common-test',
    props:{
      components:[
        {
          //invalid id
          id:'18d191238e9122022',
          quantity:2
        },
      ],
      stock:1,
      price:100,
      cost:50,
    }
  })
  .expect(400);
  
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(0);
  

  //create bom with invalid component (no name or id)
  bom =await request(app)
  .post('/api/v1/common/boms')
  .send({ 
    name:'BOM A',
    domain:['manufacture'],
    app:'common-test',
    props:{
      components:[
        {
          //invalid component
          quantity:2
        },
      ],
      stock:1,
      price:100,
      cost:50,
    }
  })
  .expect(400);
  
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(0);

  
 

});
