import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { notFound } from "./middlewares/notFound.middleware";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mini-erp-12.web.app",
  "https://mini-erp-12.firebaseapp.com",
  "https://mini-erp-black.vercel.app",
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

// ⚠️ REMOVE THIS LINE ⚠️
// app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1", routes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;