import express from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError, DatabaseOperationError } from "../errors";
// import { RequestValidationError } from "../errors/RequestValidationError";
// import { DatabaseOperationError } from "../errors/DatabaseOperationError";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail(),
    body("password").trim().isLength({ min: 5, max: 20 }),
  ],
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    throw new DatabaseOperationError();
    // res.status(201).send("Successful sign in");
  }
);

export { router as signinRouter };
