import express from "express";
import { NotFoundError } from "@ht2ickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!id) throw new NotFoundError();
      const ticket = await Ticket.findById(id);
      if (!ticket) throw new NotFoundError();
      res.status(200).send(ticket);
    } catch (error) {
      return next(error);
    }
  }
);

export {router as showTicketRouter}