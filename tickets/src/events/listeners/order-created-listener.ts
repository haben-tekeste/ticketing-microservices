import {
  Listener,
  NotFoundError,
  OrderCreated,
  Subjects,
} from "@ht2ickets/common";
import { queueGroupName } from "./queue-group-name";
import { Msg } from "nats";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreated> {
  durableName = "order-created-ticket-durable";
  queueGroupName = queueGroupName;
  filterSubject = Subjects.EventOrderCreated;
  deliverSubject = Subjects.OrderCreated;
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  streamName = "mystream";
  async onMessage(data: OrderCreated["data"], msg: Msg): Promise<void> {
    // find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if not ticket, throw error
    if (!ticket) throw new Error("Ticket not found error!");

    // mark the ticket as being reserved by settings its order id
    ticket.set({ orderId: data.id });

    // save changes
    await ticket.save();

    // ticket version has been updated
    // so even we need to update ticket on order service by publishing event
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId
    });

    // acknowledge message
    msg.respond();
  }
}
