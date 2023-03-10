import mongoose from "mongoose";
import { PasswordManager } from "../util/password";

// An interface that describes
// properties required to create user
interface IUser {
  email: string;
  password: string;
}

// an interface that describes
// the properties of a user model

interface IModel extends mongoose.Model<IDocument> {
  build(usr: IUser): IDocument;
}

// an interface that describes the properties
// a user document has

interface IDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (usr: IUser) => {
  return new User(usr);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // encrypt only when password is changed or created for the first time
    const hash = await PasswordManager.hashPassword(this.get("password"));
    this.set("password", hash);
  }
  next();
});

export const User = mongoose.model<IDocument, IModel>("User", userSchema);
