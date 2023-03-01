import { Listener, OrderCreated, Subjects } from "@ht2ickets/common";
import { Msg } from "nats";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreated> {
  deliverSubject = Subjects.OrderCreated;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = "mystream";
  filterSubject = Subjects.EventOrderCreated;
  queueGroupName = queueGroupName;
  durableName = "order-created-expiration-durable";
  onMessage(data: OrderCreated["data"], msg: Msg){
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Processing event: ", data);
    
    expirationQueue.add(
      { orderId: data.id },
      {
        delay: 60000,
      }
    );

    msg.respond();
  }
}
