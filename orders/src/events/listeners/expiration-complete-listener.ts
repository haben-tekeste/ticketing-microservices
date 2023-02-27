import {
  Subjects,
  Listener,
  ExpirationComplete,
  OrderStatus,
} from "@ht2ickets/common";
import { Msg } from "nats";
import { Order } from "../../models/order";
import { natswrapper } from "../../nats-wrapper";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationComplete> {
  deliverSubject = Subjects.ExpirationComplete;
  durableName = "expiration-complete-ticket-durable";
  filterSubject = Subjects.EventExpirationComplete;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  streamName = "mystream";
  queueGroupName = "orders-service";
  async onMessage(data: ExpirationComplete["data"], msg: Msg) {
    //
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) throw new Error("Order not found");

    // if order is already paid and completed
    // we dont want to change anything
    if (order.status === OrderStatus.Completed) return msg.respond();

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    await new OrderCancelledPublisher(natswrapper.Client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.respond();
  }
}
