import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../user/user.model";
import { ApiError } from "../../utils/ApiError";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const expiresIn = (process.env.JWT_EXPIRES_IN as string | undefined) || "7d";
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: expiresIn as any }
  );

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};