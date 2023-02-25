import { natswrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.NATS_URL) throw new Error("Nats url must be defined");

  try {
    await natswrapper.connect(process.env.NATS_URL);
    const jsm = await natswrapper.Client.jetstreamManager();
    await jsm.streams.add({ name: "mystream", subjects: ["events.>"] });

    process.on("SIGTERM", () =>
      natswrapper.Client.close().then(() => {
        console.log("nats closed");
        process.exit();
      })
    );
    new OrderCreatedListener(natswrapper.Client).listen();
  } catch (error) {
    console.error(error);
  }
};

start();
