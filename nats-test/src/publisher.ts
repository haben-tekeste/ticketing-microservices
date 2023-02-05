import { connect, StringCodec } from "nats";

try {
  (async () => {
    // to create a connection to a nats-server:
    const nc = await connect({ servers: "http://localhost:4222" });
    
    // create a codec
    const sc = StringCodec();
    
    // create jsm manager
    const jsm = await nc.jetstreamManager();
    
    // add a stream
    await jsm.streams.add({ name: "test1", subjects: [`ticket.>`] });
    
    const js = nc.jetstream();
    
    // publish
    await js.publish("ticket.created", sc.encode("Hello World"),{
      expect:{streamName:'test1'}
    });

    // await nc.drain();
  })();
} catch (error) {
  console.log(error);
}

