import Queue from "bull"
import { natswrapper } from "../nats-wrapper";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order.expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natswrapper.Client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
