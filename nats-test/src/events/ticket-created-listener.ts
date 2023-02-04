import { Listener } from "./base-listener"
import { Msg } from "nats"
import { TicketCreatedEvent } from "./ticket-created-event"
import { Subjects } from "./subjects"

export class TicketCreatedListener extends Listener <TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payments-service'
    filterSubject = ''
    durableName = 'ticket-durable'
    streamName = 'test1'
    deliverSubject = 'created'
  
    onMessage(data:TicketCreatedEvent['data'], msg:Msg){
      console.log('Event data!', data);
      msg.respond()
      
    }
  }