import express from "express";
import {
  signinRouter,
  signupRouter,
  signoutRouter,
  currentuserRouter,
} from "./routes";
import { errorHandler } from "./middleware/error-handler";
import { NotFoundError } from "./errors/NotFoundError";

const app = express();

app.use(express.json());

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

app.listen(4000, () => {
  console.log("Auth Service running at port 4000");
});
