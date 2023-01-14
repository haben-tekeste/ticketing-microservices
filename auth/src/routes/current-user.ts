import express from "express";
import { isAuth } from "../middleware/isAuth";
import { currentUserMiddleware } from "../middleware/current-user-mw";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserMiddleware,
  (req, res, next) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentuserRouter };
