import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes
// properties required to create ticket
interface ITicket {
  title: string;
  price: number;
  userId: string;
}

// an interface that describes
// the properties of a ticket model

interface IModel extends mongoose.Model<IDocument> {
  build(usr: ITicket): IDocument;
}

// an interface that describes the properties
// a user document has

interface IDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId? :string;
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
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String
    }
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
  return new Ticket(ticket);
};

export const Ticket = mongoose.model<IDocument, IModel>("Ticket", ticketSchema);
