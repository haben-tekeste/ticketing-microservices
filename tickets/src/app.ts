import express from "express";
import cookieSession from "cookie-session";
import { errorHandler } from "@ht2ickets/common";
import { NotFoundError } from "@ht2ickets/common";

const app = express();

app.set("proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    // secure: true,
    signed: false,
  })
);


// 404 error
app.use("*", (req, res) => {
  throw new NotFoundError();
});

// handling errors
app.use(errorHandler);

export { app };
