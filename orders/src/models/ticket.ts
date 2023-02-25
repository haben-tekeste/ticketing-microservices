import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@ht2ickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes
// properties required to create ticket
interface ITicket {
  id: string;
  title: string;
  price: number;
  // userId: string;
}
// an interface that describes the properties
// a user document has

export interface IDocument extends mongoose.Document {
  title: string;
  price: number;
  // userId: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// an interface that describes
// the properties of a ticket model

interface IModel extends mongoose.Model<IDocument> {
  build(usr: ITicket): IDocument;
  findTicketByEvent(event: {
    id: string;
    version: number;
  }): Promise<IDocument | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // userId: {
    //   type: mongoose.Types.ObjectId,
    //   required: true,
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (ticket: ITicket) => {
  return new Ticket({
    _id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    // userId: ticket.userId,
  });
};

ticketSchema.statics.findTicketByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// go through all the orders and look for the
// ticket which was found and the order status is not cancelled
// if there is an order matching the query it means ticket is reserved
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed,
        OrderStatus.Created,
      ],
    },
  });
  return !!existingOrder;
};

export const Ticket = mongoose.model<IDocument, IModel>("Ticket", ticketSchema);
