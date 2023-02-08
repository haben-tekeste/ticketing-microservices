import { Publisher, Subjects, TicketUpdatedEvent, TicketUpdated } from "@ht2ickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.EventTicketUpdated = Subjects.EventTicketUpdated
}