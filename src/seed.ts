import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./modules/user/user.model";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  const existingAdmin = await User.findOne({ email: "admin@mini-erp.com" });
  if (!existingAdmin) {
    await User.create({
      name: "Admin User",
      email: "admin@mini-erp.com",
      password: "admin123",
      role: "admin",
    });
  }

  console.log("Seed complete");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
