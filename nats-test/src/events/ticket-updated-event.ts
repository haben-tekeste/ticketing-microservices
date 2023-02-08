import { Subjects } from "./subjects";
import { Ticket } from "./ticket-interface";

export interface TicketUpdatedEvent extends Ticket{
  subject: Subjects.EventTicketUpdated;
}
export interface TicketUpdated extends Ticket{
  subject: Subjects.TicketUpdated
}
