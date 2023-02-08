import { Listener } from "./base-listener"
import { Msg } from "nats"
import { TicketCreated } from "./ticket-created-event"
import { Subjects } from "./subjects"

export class TicketCreatedListener extends Listener <TicketCreated>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payments-service'
    filterSubject = Subjects.EventTicketCreated
    durableName = 'ticket-durable'
    streamName = 'mystream'
    deliverSubject = Subjects.TicketCreated
  
    onMessage(data:TicketCreated['data'], msg:Msg){
      console.log('Event data!', data);
      msg.respond()
      
    }
  }
