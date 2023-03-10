import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

declare global {
  function cookieRetrieval(): string[];
}

let mongo: any;

jest.mock("../nats-wrapper.ts");

beforeAll(async () => {
  process.env.JWT_KEY = "random123";
  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();

  await mongoose.connect(mongoURI);
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

// this function retrieves cookies sent
// after successful signup
// it is made as a function since other services
// apart from auth might use it
global.cookieRetrieval = () => {
  // jwt payload
  const payload = {
    email: "test@test.com",
    id: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create the JWT!
  const token = jsonwebtoken.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
