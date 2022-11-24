import request from 'supertest';
import { app } from '../../../app';



it('should return success if the application was added with props', async () => {
  var key:string;
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

    var id = response.body.data.application.id
    response =await request(app)
    .put('/api/v1/common/applications/generate/'+id)
    .expect(200);

    console.log('generate key ',response.body.data);
    expect(response.body.data).toBeDefined();
    key=response.body.data;

    response =await request(app)
    .get('/api/v1/common/applications/'+id+'?userKey='+key)
    .expect(200);
    console.log('application access',response.body)

    expect(response.body.access.status).toBe(200)

    response =await request(app)
    .get('/api/v1/common/applications/'+id+'?userKey=12414214d1aef23.ab12510930')
    .expect(200);
    console.log('application access',response.body)

    expect(response.body.access.status).toBe(401)

    response =await request(app)
    .get('/api/v1/common/applications/'+id)
    .expect(200);
    console.log('application access',response.body)

    expect(response.body.access.status).toBe(404)
    
});