import {
  Listener,
  OrderCancelled,
  OrderStatus,
  Subjects,
} from "@ht2ickets/common";
import { Msg } from "nats";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelled> {
  deliverSubject = Subjects.OrderCancelled;
  filterSubject = Subjects.EventOrderCancelled;
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  streamName = "mystream";
  durableName = "order-cancelled-payments-durable";
  async onMessage(data: OrderCancelled["data"], msg: Msg) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new Error("Order not found");

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    msg.respond();
  }
}
