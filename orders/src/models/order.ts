import mongoose from "mongoose";
import { OrderStatus } from "@ht2ickets/common";
import { IDocument as TicketDoc } from "./ticket";

// An interface that describes
// properties required to create order
interface IOrder {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

// an interface that describes
// the properties of a order model

interface IModel extends mongoose.Model<IDocument> {
  build(usr: IOrder): IDocument;
}

// an interface that describes the properties
// a order document has

interface IDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
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

orderSchema.statics.build = (order: IOrder) => {
  return new Order(order);
};


export const Order = mongoose.model<IDocument, IModel>("Order", orderSchema);
