import { isAuth, NotFoundError } from "@ht2ickets/common";
import express, { Request, Response, NextFunction } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/",
  isAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket');
      if (!orders) throw new NotFoundError();
      res.status(200).send(orders);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getAllOrdersRouter };
