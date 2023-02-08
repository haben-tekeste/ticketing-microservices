import { TicketUpdated } from "./ticket-updated-event";
import { Subjects } from "./subjects";
import { Listener } from "./base-listener";
import { Msg } from "nats";

export class TicketUpdatedListener extends Listener<TicketUpdated> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = "payments-service";
  filterSubject = Subjects.EventTicketUpdated;
  durableName = "ticket-updated";
  streamName = "mystream";
  deliverSubject = Subjects.TicketUpdated;

  onMessage(data: TicketUpdated["data"], msg: Msg) {
    console.log("Event data!", data);
    msg.respond();
  }
}
