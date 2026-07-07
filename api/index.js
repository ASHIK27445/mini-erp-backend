const serverless = require("serverless-http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("../dist/app").default;

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI is not set");
  await mongoose.connect(mongoUri);
  isConnected = true;
};

const handler = serverless(app);

module.exports = async (req, res) => {
  await connectDB();
  return handler(req, res);
};