import express from "express";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUserMiddleware,
} from "@ht2ickets/common";
import {
  getAllOrdersRouter,
  getOrderRouter,
  deleteOrderRouter,
  createOrderRouter,
} from "./routes";

const app = express();

app.set("proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    // secure: true,
    signed: false,
  })
);

//
app.use(currentUserMiddleware);

// routes
app.use(getAllOrdersRouter);
app.use(getOrderRouter);
app.use(deleteOrderRouter);
app.use(createOrderRouter);

// 404 error
app.use("*", (req, res) => {
  throw new NotFoundError();
});

// handling errors
app.use(errorHandler);

export { app };
