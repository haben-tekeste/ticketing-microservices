import express from "express";
import mongoose from "mongoose";
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
    secure: true,
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

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT Failed");
  try {
    await mongoose.connect("mongodb://mongodb-auth-srv:27017/auth");
  } catch (error) {
    console.error(error);
  }
  app.listen(4000, () => {
    console.log("Auth Service running at port 4000!");
  });
};

start();
