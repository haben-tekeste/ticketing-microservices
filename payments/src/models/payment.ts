import mongoose from "mongoose";

interface IPayment {
  orderId: string;
  stripeId: string;
}

interface IDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface IModel extends mongoose.Model<IDocument> {
  build(payment: IPayment): IDocument;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
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

paymentSchema.statics.build = (payment: IPayment) => {
  return new Payment(payment);
};

export const Payment = mongoose.model<IDocument, IModel>("Payment", paymentSchema);
