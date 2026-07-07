import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  // If already connected (readyState 1 = connected), reuse it
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
  console.log("MongoDB connected");
};