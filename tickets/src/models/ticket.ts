import mongoose from "mongoose";


// An interface that describes
// properties required to create ticket
interface ITicket {
  title: string;
  price: string;
  userId: string
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
  price: string;
  userId: string;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    userId:{
        type: String,
        required:true,
    }
  }
  , {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
        }
    }
  }
);

ticketSchema.statics.build = (ticket: ITicket) => {
  return new Ticket(ticket);
};


export const Ticket = mongoose.model<IDocument, IModel>("Ticket", ticketSchema);
