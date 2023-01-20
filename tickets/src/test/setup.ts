import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from 'supertest'

declare global{
      function cookieRetrieval(): Promise<string[]>
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "random123";
  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();

  await mongoose.connect(mongoURI);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
});

// this function retrieves cookies sent 
// after successful signup
// it is made as a function since other services
// apart from auth might use it 
global.cookieRetrieval = async () => {
  const email = 'test@test.com';
  const password = 'random123'

  const response = await request(app).post('/api/users/signup').send({email,password}).expect(201)
  const cookie = response.get('Set-Cookie');
  return cookie;
}