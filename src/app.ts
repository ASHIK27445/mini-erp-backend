import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { connectDB } from "./db";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mini-erp-12.web.app",
  "https://mini-erp-12.firebaseapp.com",
  "https://mini-erp-seven-gilt.vercel.app",
];

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Ensure MongoDB is connected before hitting any /api route.
// Needed because in the Vercel serverless function, server.ts (which used
// to call mongoose.connect) never runs — only app.ts is imported.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api/v1", routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;