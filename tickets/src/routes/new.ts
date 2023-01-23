import express from "express";
import { isAuth, validateRequest } from "@ht2ickets/common";
import { body } from "express-validator";
import { currentUserMiddleware } from "@ht2ickets/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
  "/api/tickets",
  currentUserMiddleware,
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
      const { title, price } = req.body;
      const ticket = new Ticket({ title, price, userId: req.currentUser!.id });
      await ticket.save();
      res.status(200).send({});
    } catch (error) {
      next(error);
    }
  }
);

export { router as createTicketRouter };
