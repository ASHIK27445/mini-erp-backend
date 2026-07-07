import app from "../app";
import serverless from "serverless-http";
import mongoose from "mongoose";
import { User } from "../modules/user/user.model";
import bcrypt from "bcrypt";

let isConnected = false;

export const handler = serverless(async (req: any, res: any) => {
  console.log("📨 Request:", req.method, req.path);
  
  try {
    // Check MongoDB connection
    if (!isConnected) {
      console.log("🔌 Connecting to DB...");
      const mongoUri = process.env.MONGO_URI;
      
      if (!mongoUri) {
        console.error("❌ MONGO_URI is undefined!");
        return res.status(500).json({ 
          success: false, 
          message: "MONGO_URI not configured" 
        });
      }

      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log("✅ DB Connected");
      
      // Create admin user if not exists
      const adminExists = await User.findOne({ email: "admin@mini-erp.com" });
      if (!adminExists) {
        console.log("👤 Creating admin...");
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await User.create({
          name: "Admin User",
          email: "admin@mini-erp.com",
          password: hashedPassword,
          role: "admin",
        });
        console.log("✅ Admin created");
      }
    }
    
    // Handle request
    return app(req, res);
    
  } catch (error: any) {
    console.error("💥 ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});