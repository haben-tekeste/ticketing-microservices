import {
  Listener,
  TicketUpdated,
  Subjects,
  NotFoundError,
} from "@ht2ickets/common";
import { Msg } from "nats";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdated> {
  deliverSubject = Subjects.TicketUpdated;
  durableName = "ticket-updated-order-durable";
  queueGroupName = "orders-service";
  filterSubject = Subjects.EventTicketUpdated;
  streamName = "mystream";
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  async onMessage(data: TicketUpdated["data"], msg: Msg): Promise<void> {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findTicketByEvent(data);

    if (!ticket) throw new NotFoundError();

    ticket.set({ title, price });

    await ticket.save();

    msg.respond();
  }
}
