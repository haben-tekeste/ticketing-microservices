import mongoose from "mongoose";
import { OrderStatus } from "@ht2ickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes
// properties required to create order
interface IOrder {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
  id: string;
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
  price: number;
  version: number;
  id: string;
}

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (order: IOrder) => {
  return new Order({
    _id: order.id,
    version: order.version,
    price: order.price,
    status: order.status,
    userId: order.userId,
  });
};

export const Order = mongoose.model<IDocument, IModel>("Order", orderSchema);
