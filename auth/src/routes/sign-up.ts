import express from "express";
import { User } from "../models/User";
import { body } from "express-validator";
import { BadRequestError } from "../errors";
import jsonwebtoken from "jsonwebtoken";
import { validateRequest } from "../middleware/validate-request";

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
  validateRequest,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email already in use");
      }
      const newUser = User.build({ email, password });
      await newUser.save();
      const jwtToken = jsonwebtoken.sign(
        {
          id: newUser._id,
          email: newUser.email,
        },
        process.env.JWT_KEY!
      );
      req.session = { jwt: jwtToken };
      res.status(201).json(newUser);
    } catch (error) {
      console.log("caught error ", error);

      return next(error);
    }
  }
);

export { router as signupRouter };
