import { Subjects } from "./subjects";
import { Ticket } from "./ticket-interface";

export interface TicketCreatedEvent extends Ticket {
  subject: Subjects.EventTicketCreated;
}

export interface TicketCreated extends Ticket{
  subject: Subjects.TicketCreated;
}
