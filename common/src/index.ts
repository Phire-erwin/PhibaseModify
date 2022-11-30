import mongoose from 'mongoose';

import { app } from './app';

// import { natsWrapper } from './nats-wrapper';
// import { LogCreatedListener } from './events/listeners/log-created-listener';
// import { ItemStockChangeListener } from './events/listeners/item-stock-change-listener';
const start = async () => {
  console.log('Starting...');
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined!!');
  // }
  // if (!process.env.MONGO_URI) {
  //   throw new Error('MONGO_URI must be defined!');
  // }
  // if (!process.env.NODE_ENV) {
  //   throw new Error('NODE_ENV must be defined!');
  // }
  // if (!process.env.NATS_CLIENT_ID) {
  //   throw new Error('NATS_CLIENT_ID must be defined');
  // }
  // if (!process.env.NATS_URL) {
  //   throw new Error('NATS_URL must be defined!');
  // }
  // if (!process.env.NATS_CLUSTER_ID) {
  //   throw new Error('NATS_CLUSTER_ID must be defined');
  // }

  // if (!process.env.MONGO_SSL_REQUIRED){
  //   throw new Error('MONGO_SSL_REQUIRED must be defined');
  // }

  // //get mongo certificate
  // var sslRequired=(process.env.MONGO_SSL_REQUIRED=='true')?true:false
  // var ca = undefined;
  // if(sslRequired){

  //   //check for certificate env
  //   if (!process.env.MONGO_SSL_CERTIFICATE) {
  //     throw new Error('MONGO_SSL_CERTIFICATE must be defined');
  //   }
  //   ca = [process.env.MONGO_SSL_CERTIFICATE]
  // }


  try {
    // await natsWrapper.connect(
    //   process.env.NATS_CLUSTER_ID,
    //   process.env.NATS_CLIENT_ID,
    //   process.env.NATS_URL,
    // );
    // natsWrapper.client.on('close', () => {
    //   console.log('Order service NATS connection closed!');
    //   process.exit();
    // });

    // new LogCreatedListener(natsWrapper.client).listen();
    // new ItemStockChangeListener(natsWrapper.client).listen();
    // process.on('SIGINT', () => natsWrapper.client.close());
    // process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect('mongodb://127.0.0.1:27017');
    console.info('Connected to MongoDB!');
  } catch (err) {
    console.error(err);
    process.exit();
  }
  app.listen(3002, () => {
    console.info('Server Listening on port 3002');
  });
};

start();
