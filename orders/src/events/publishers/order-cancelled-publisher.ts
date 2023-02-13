import { Subjects, Publisher, OrderCancelledEvent } from "@ht2ickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.EventOrderCancelled = Subjects.EventOrderCancelled
}