import mongoose from "mongoose";
import { app } from "./app";
import { natswrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT Failed ");
  if (!process.env.MONGO_URI) throw new Error("Mongo URI must be defined");
  if (!process.env.NATS_URL) throw new Error("Nats url must be defined");

  try {
    await natswrapper.connect(process.env.NATS_URL);
    await mongoose.connect(process.env.MONGO_URI);
    const jsm = await natswrapper.Client.jetstreamManager();
    await jsm.streams.add({name:"mystream",subjects:["events.>"]})
    
    process.on("SIGTERM", () =>
      natswrapper.Client.close().then(() => {
        console.log("nats closed");
        process.exit();
      })
    );
  
  } catch (error) {
    console.error(error);
  }
  app.listen(4003, () => {
    console.log("Payments Service running at port 4003!!");
  });
};

start();
