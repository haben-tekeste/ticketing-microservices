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
      res.status(200).send({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createChargeRouter };
