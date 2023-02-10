import {
  BadRequestError,
  isAuth,
  NotAuthorizedError,
  NotFoundError,
} from "@ht2ickets/common";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:id",
  isAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new BadRequestError("Please provide valid order number");
      const order = await Order.findById(id).populate("ticket");
      if (!order) throw new NotFoundError();
      if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
      res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getOrderRouter };
