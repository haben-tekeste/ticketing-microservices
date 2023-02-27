import express from "express";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUserMiddleware,
} from "@ht2ickets/common";
import { createChargeRouter } from "./routes/new";

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
app.use(createChargeRouter)

// 404 error
app.use("*", (req, res) => {
  throw new NotFoundError();
});

// handling errors
app.use(errorHandler);

export { app };
