import { natswrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.NATS_URL) throw new Error("Nats url must be defined");

  try {
    await natswrapper.connect(process.env.NATS_URL);
    const jsm = await natswrapper.Client.jetstreamManager();

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
