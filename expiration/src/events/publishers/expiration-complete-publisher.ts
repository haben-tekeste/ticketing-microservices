import { Subjects, ExpirationCompleteEvent, Publisher } from "@ht2ickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.EventExpirationComplete = Subjects.EventExpirationComplete
}