import { Subjects, OrderCreatedEvent, Publisher } from "@ht2ickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.EventOrderCreated = Subjects.EventOrderCreated
}