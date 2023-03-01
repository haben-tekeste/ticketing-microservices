import express, { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  isAuth,
  NotAuthorizedError,
  OrderStatus,
  validateRequest,
} from "@ht2ickets/common";
import { Order } from "../models/order";
import { body } from "express-validator";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natswrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  isAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, orderId } = req.body;
      const order = await Order.findById(orderId);
      if (!order) throw new Error("Order not found");
      if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
      if (order.status === OrderStatus.Cancelled)
        throw new BadRequestError("Can not pay for a cancelled order");
      const { id } = await stripe.charges.create({
        amount: order.price * 100,
        currency: "aed",
        source: token,
        description: order.id,
      });
      const payment = Payment.build({
        orderId,
        stripeId: id,
      });
      await payment.save();

      await new PaymentCreatedPublisher(natswrapper.Client).publish({
        id: payment.id,
        stripeId: payment.stripeId,
        orderId: payment.orderId,
          });
      res.status(201).send({ id: payment.id });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createChargeRouter };
