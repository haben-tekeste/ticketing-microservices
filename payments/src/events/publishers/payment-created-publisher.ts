import { Subjects, Publisher, PaymentCreatedEvent } from "@ht2ickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject:Subjects.EventPaymentCreated = Subjects.EventPaymentCreated
}