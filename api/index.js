const serverless = require("serverless-http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Load app with error handling
let app;
try {
  const appModule = require("../dist/app");
  app = appModule.default || appModule;
  console.log("✅ App loaded successfully");
} catch (error) {
  console.error("❌ Failed to load app:", error.message);
  
  // Fallback app if loading fails
  const express = require("express");
  app = express();
  app.get("*", (req, res) => {
    res.status(200).json({ 
      success: true, 
      message: "API is running (fallback mode)",
      note: "Check app build"
    });
  });
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing DB connection");
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn("⚠️ MONGO_URI not found - running without DB");
      return;
    }

    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return;
    }

    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Don't throw - let the app run
  }
};

const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    await connectDB();
    return handler(req, res);
  } catch (error) {
    console.error("❌ Serverless error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};