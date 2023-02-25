import { Listener, OrderCreated, Subjects } from "@ht2ickets/common";
import { Msg } from "nats";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreated> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = "mystream";
  deliverSubject = Subjects.OrderCreated;
  filterSubject = Subjects.EventOrderCreated;
  queueGroupName = queueGroupName;
  durableName = "order-created-expiration-durable";
  async onMessage(data: OrderCreated["data"], msg: Msg): Promise<void> {
    expirationQueue.add({ orderId: data.id });

    msg.respond();
  }
}
