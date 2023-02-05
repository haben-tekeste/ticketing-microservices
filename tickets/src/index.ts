import mongoose from "mongoose";
import { app } from "./app";
import { natswrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT Failed");
  if (!process.env.MONGO_URI) throw new Error("Mongo URI must be defined");
  try {
    await natswrapper.connect("http://nats-srv:4222");
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
  }
  app.listen(4001, () => {
    console.log("Tickets Service running at port 4001! ");
  });
};

start();
