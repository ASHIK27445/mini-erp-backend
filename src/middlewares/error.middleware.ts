import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Always log the real error so it shows up in Vercel's function logs,
  // even when NODE_ENV isn't "development".
  console.error(err);

  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  } else if (err.message === "MONGO_URI is not set in environment variables") {
    statusCode = 500;
    message = "Server misconfiguration: MONGO_URI is missing";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};