import express from "express";
import { body, validationResult } from "express-validator";
import { DatabaseOperationError } from "../errors/DatabaseOperationError";
import { RequestValidationError } from "../errors/RequestValidationError";

const router = express.Router();

router.post(
  "/api/users/signup",
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
    res.status(201).send("Successful sign up");
  }
);

export { router as signupRouter };
