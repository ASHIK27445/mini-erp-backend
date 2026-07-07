import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./db";
import { User } from "./modules/user/user.model";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const seedAdminUser = async () => {
  const existingAdmin = await User.findOne({ email: "admin@mini-erp.com" });
  if (!existingAdmin) {
    await User.create({
      name: "Admin User",
      email: "admin@mini-erp.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Admin user seeded");
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();