import express from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  isAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@ht2ickets/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natswrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  isAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!id) return new NotFoundError();

      const ticket = await Ticket.findById(id);
      if (!ticket) throw new NotFoundError();
      if (ticket.orderId)
        throw new BadRequestError("Reserved Error can not be updated");
      if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      ticket.set({
        title: req.body.title,
        price: req.body.price,
      });
      await ticket.save();

      await new TicketUpdatedPublisher(natswrapper.Client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      });

      res.send(ticket);
    } catch (error) {
      return next(error);
    }
  }
);

export { router as updateTicketRouter };
