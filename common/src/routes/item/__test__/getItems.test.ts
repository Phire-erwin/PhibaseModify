
import request from 'supertest';
import { app } from '../../../app';

it('get item should work', async () => {

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
  
  var items=await request(app)
    .get('/api/v1/common/items')
    .expect(200);

  expect(items.body.data).toHaveLength(1)

  await request(app)
    .post('/api/v1/common/items')
    .send({ 
      name:'yes',
      domain:['distribution'],
      app:'common-test',
      props:{
        id: 'rm2',
        stock:1,
        price:100,
        cost:50,
    }
  })
  .expect(200);
  
  items=await request(app)
    .get('/api/v1/common/items')
    .expect(200);

  expect(items.body.data).toHaveLength(2);

  await request(app)
    .post('/api/v1/common/items')
    .send({ 
      name:'yes',
      domain:['distribution'],
      app:'common-test',
      props:{
        id: 'rm3',
        stock:1,
        price:100,
        cost:50,
    }
  })
  .expect(200);
  
  items=await request(app)
    .get('/api/v1/common/items')
    .expect(200);

  expect(items.body.data).toHaveLength(3)

  items=await request(app)
    .get('/api/v1/common/items?app=common-test')
    .expect(200);

  expect(items.body.data).toHaveLength(2);

  
  items=await request(app)
    .get('/api/v1/common/items?app=ayaya')
    .expect(200);
  
  expect(items.body.data).toHaveLength(0);


});


