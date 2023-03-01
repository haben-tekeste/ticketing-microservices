import {
  Listener,
  OrderStatus,
  PaymentCreated,
  Subjects,
} from "@ht2ickets/common";
import { Msg } from "nats";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreated> {
  deliverSubject = Subjects.PaymentCreated;
  durableName = "payment-created-order-durable";
  queueGroupName = "orders-service";
  filterSubject = Subjects.EventPaymentCreated;
  streamName = "mystream";
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;

  async onMessage(data: PaymentCreated["data"], msg: Msg): Promise<void> {
    const { id, orderId, stripeId } = data;

    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.set({
      status: OrderStatus.Completed,
    });

    await order.save();
    msg.respond();
  }
}
