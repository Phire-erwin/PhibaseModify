import { MongoMemoryServer }from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

import { LogCreatedListener } from '../events/listeners/log-created-listener';
import { ItemStockChangeListener } from '../events/listeners/item-stock-change-listener';

import { natsWrapper } from '../nats-wrapper';
import { UserCreatedEvent,LogCreatedEvent,ItemStockChangeEvent } from '@phibase/common-v2';

declare global {
  function login(): Promise<string[]>;
  function emulateRegistryEvent(): Promise<any>;
  function emulateLogCreateEvent(): Promise<any>;
  function emulateItemStockChangeEvent(itemList:any[]):Promise<any>;
}
jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'fakeKey';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  process.env.APP_ID = 'phiresuite-test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();


  mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  
  await mongo.stop();
  await mongoose.connection.close();
});

global.login = async () => {
  const response = await request(app)
    .post('/api/v1/common/auth/register')
    .send({
      email   : 'test@test.com',
      password: 'password',
      roleRef : {
        id: '6195d4ec564f6c0018b15359',
        name: 'Super Admin'
      },
      props: {
        app: process.env.APP_ID
      }
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};

global.emulateItemStockChangeEvent= async(itemList:any[])=>{
  const listener = new ItemStockChangeListener(natsWrapper.client);
  //const { itemStockChangeList,source,message,props } = data;  
  const data: ItemStockChangeEvent['data']={
    itemStockChangeList:itemList,
    source:'common',
    props:{
      yes:''
    },
  }
  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, listener };
}

global.emulateLogCreateEvent= async()=>{
  const listener = new LogCreatedListener(natsWrapper.client);

  const data: LogCreatedEvent['data']={
    props:{
      timestamp:new Date(),
      function:'Add Item',
      user:'Agus',
      priority:3
    },
    app:'Le Feu',
    domain: 'Commerce'
  }
  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, listener };
}

global.emulateRegistryEvent= async()=>{
  const listener = new LogCreatedListener(natsWrapper.client);

  const data: UserCreatedEvent['data']={
    id:'111',
    version:-1,
    // username:'eyjafjalla',
    email:'yes@no.com',
    password:'auauaua',
    role:'admin',
    // domain: ['Common']
  }
  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, listener };
}

function beforeAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}


function beforeEach(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}


function afterAll(arg0: () => Promise<void>) {
  throw new Error('Function not implemented.');
}
