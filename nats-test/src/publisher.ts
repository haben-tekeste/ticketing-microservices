import { connect, StringCodec } from "nats";

(async () => {
  // to create a connection to a nats-server:
  const nc = await connect({ servers: "http://localhost:4222" });

  // create a codec
  const sc = StringCodec();

  // create a simple subscriber and iterate over messages
  // matching the subscription
  nc.publish("hello", sc.encode("world"));
  nc.publish("hello1", sc.encode("again"));

  // await nc.drain();
})();
