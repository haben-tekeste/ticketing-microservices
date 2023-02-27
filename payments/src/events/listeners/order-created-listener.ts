import {
  Listener,
  NotFoundError,
  OrderCreated,
  Subjects,
} from "@ht2ickets/common";
import { queueGroupName } from "./queue-group-name";
import { Msg } from "nats";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreated> {
  durableName = "order-created-payments-durable";
  queueGroupName = queueGroupName;
  filterSubject = Subjects.EventOrderCreated;
  deliverSubject = Subjects.OrderCreated;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = "mystream";
  async onMessage(data: OrderCreated["data"], msg: Msg): Promise<void> {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      userId: data.userId,
      status: data.status,
      version: data.version,
    });
    await order.save();
    // acknowledge message
    msg.respond();
  }
}
