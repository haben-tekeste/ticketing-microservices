import { connect, StringCodec } from "nats";

(async () => {
  // to create a connection to a nats-server:
  const nc = await connect({ servers: "http://localhost:4222" });

  // create a codec
  const sc = StringCodec();

  // create a simple subscriber and iterate over messages
  // matching the subscription
  const sub = nc.subscribe("hello");

  (async () => {
    for await (const m of sub) {
      console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    }
    console.log("subscription closed");
  })();

  // await nc.drain();
})();
