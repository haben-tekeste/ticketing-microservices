import express from "express";
import { User } from "../models/User";
import { body, validationResult } from "express-validator";
import { BadRequestError, RequestValidationError } from "../errors";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage("Password must be between 5 and 20"),
  ],
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email already in use");
      }
      const newUser = User.build({ email, password });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.log("caught error ", error);

      return next(error);
    }
  }
);

export { router as signupRouter };
