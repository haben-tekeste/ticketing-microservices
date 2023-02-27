import { natswrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  if (!process.env.NATS_URL) throw new Error("Nats url must be defined");
  if (!process.env.REDIS_HOST) throw new Error("Redis host not found")

  try {
    await natswrapper.connect(process.env.NATS_URL);
    const jsm = await natswrapper.Client.jetstreamManager();
    await jsm.streams.add({ name: "mystream", subjects: ["events.>"] });

    new OrderCreatedListener(natswrapper.Client).listen();
    process.on("SIGTERM", () =>
      natswrapper.Client.close().then(() => {
        console.log("nats closed");
        process.exit();
      })
    );
  } catch (error) {
    console.error(error);
  }
};

start();
