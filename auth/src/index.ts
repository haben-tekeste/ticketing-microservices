import mongoose from "mongoose";
import { app } from "./app";

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
