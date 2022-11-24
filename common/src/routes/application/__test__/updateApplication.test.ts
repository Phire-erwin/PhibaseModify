
import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('udpate application, should work', async () => {
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
    var id= response.body.data.application.id;

    response =await request(app)
    .put('/api/v1/common/applications/'+id)
    .send({ 
      props:{
        description:'this is madness',
        keyRequired:false,
        handler:'Tono'
      }
    })
    .expect(200);

    expect(response.body.data.props.keyRequired).toBe(false);
    expect(response.body.data.props.handler).toBe('Tono')
});
