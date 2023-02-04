import {
  connect,
} from "nats";

import { TicketCreatedListener } from "./events/ticket-created-listener";

try {
  (async () => {
    // to create a connection to a nats-server:
    const nc = await connect({ servers: "http://localhost:4222" });

    new TicketCreatedListener(nc).listen()
  })();
} catch (error) {
  console.log(error);
}

interface Event {
  subject: string;
  data: any;
}


