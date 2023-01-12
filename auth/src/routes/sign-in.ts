import express from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/User";
import { PasswordManager } from "../util/password";
import { validateRequest } from "../middleware/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email")
      .isEmail()
      .notEmpty()
      .withMessage("Please Provide a valid email"),
    body("password").trim().notEmpty().withMessage("Please provide password"),
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
      if (!existingUser) throw new BadRequestError("Invalid Email");
      const passwordMatched = await PasswordManager.comparePassword(
        existingUser.password,
        password
      );
      if (!passwordMatched) throw new BadRequestError("Invalid Credentials");

      // Generate jwt token
      const jwtToken = jsonwebtoken.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_KEY!
      );
      req.session = { jwt: jwtToken };
      res.status(200).json(existingUser);
    } catch (error) {
      return next(error);
    }
  }
);

export { router as signinRouter };
