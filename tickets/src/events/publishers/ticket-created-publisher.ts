import { Publisher, Subjects, TicketCreatedEvent } from "@ht2ickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.EventTicketCreated = Subjects.EventTicketCreated
}