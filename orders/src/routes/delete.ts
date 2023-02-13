import express, { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natswrapper } from "../nats-wrapper";
import {
  isAuth,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@ht2ickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:id",
  isAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const order = await Order.findById(id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natswrapper.Client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
