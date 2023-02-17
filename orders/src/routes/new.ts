import express, { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  isAuth,
  NotFoundError,
  OrderStatus,
  validateRequest,
} from "@ht2ickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natswrapper } from "../nats-wrapper";

const router = express.Router();

const WINDOW_MINUTES_INTERVAL = 15 * 60; // 15 minutes

router.post(
  "/api/orders",
  isAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;

      // find the ticket user is trying to order
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) throw new NotFoundError();

      // check if ticket is already reserved
      const isReserved = await Ticket.isReserved();
      if (!isReserved) throw new BadRequestError("Ticket is already reserved");

      // calculate expiration date for order
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + WINDOW_MINUTES_INTERVAL);

      // build order and save it to db
      const order = Order.build({
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket,
        userId: req.currentUser!.id,
      });
      await order.save();

      // publish event
      new OrderCreatedPublisher(natswrapper.Client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: order.ticket.id,
          price: order.ticket.price,
        },
      });

      res.send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as createOrderRouter };
