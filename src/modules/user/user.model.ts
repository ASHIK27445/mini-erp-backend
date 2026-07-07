import { Schema, model, Document, CallbackWithoutResultAndOptionalError } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "manager", "employee"], default: "employee" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = model<IUser>("User", userSchema);