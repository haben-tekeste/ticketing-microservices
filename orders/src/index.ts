import mongoose from "mongoose";
import { app } from "./app";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { natswrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT Failed ");
  if (!process.env.MONGO_URI) throw new Error("Mongo URI must be defined");
  if (!process.env.NATS_URL) throw new Error("Nats url must be defined");

  try {
    await natswrapper.connect(process.env.NATS_URL);
    await mongoose.connect(process.env.MONGO_URI);
    const jsm = await natswrapper.Client.jetstreamManager();
    await jsm.streams.add({ name: "mystream", subjects: ["events.>"] });
    // await new TicketCreatedPublisher(natswrapper.Client).addStream(
    //   jsm,
    //   "mystream",
    //   ["events.>"]
    // );
    new TicketCreatedListener(natswrapper.Client).listen();
    new TicketUpdatedListener(natswrapper.Client).listen();
    new ExpirationCompleteListener(natswrapper.Client).listen();
    process.on("SIGTERM", () =>
      natswrapper.Client.close().then(() => {
        console.log("nats closed");
        process.exit();
      })
    );
  } catch (error) {
    console.error(error);
  }
  app.listen(4002, () => {
    console.log("Orders Service running at port 4001! ");
  });
};

start();
