import express from "express";
import cookieSession from "cookie-session";

import {
  signinRouter,
  signupRouter,
  signoutRouter,
  currentuserRouter,
} from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { NotFoundError } from "./errors/NotFoundError";

const app = express();

app.set("proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    // secure: true,
    signed: false,
  })
);

app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(currentuserRouter);

// 404 error
app.use("*", (req, res) => {
  throw new NotFoundError();
});

// handling errors
app.use(errorHandler);

export { app };
