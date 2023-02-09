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
    // await new TicketCreatedPublisher(natswrapper.Client).addStream(
    //   jsm,
    //   "mystream",
    //   ["events.>"]
    // );
    process.on("SIGTERM", () =>
      natswrapper.Client.close().then(() => {
        console.log("nats closed");
        process.exit();
      })
    );
  } catch (error) {
    console.error(error);
  }
  app.listen(4001, () => {
    console.log("Tickets Service running at port 4001! ");
  });
};

start();
