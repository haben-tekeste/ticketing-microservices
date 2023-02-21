import { Listener, TicketCreated, Subjects } from "@ht2ickets/common";
import { Msg } from "nats";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreated> {
  deliverSubject = Subjects.TicketCreated;
  durableName = "ticket-created-order-durable";
  queueGroupName = "orders-service";
  filterSubject = Subjects.EventTicketCreated;
  streamName = "mystream";
  subject: Subjects.TicketCreated = Subjects.TicketCreated;

  async onMessage(data: TicketCreated["data"], msg: Msg): Promise<void> {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
      // userId,
    });

    await ticket.save();

    msg.respond();
  }
}
