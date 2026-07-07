import app from "../app";
import serverless from "serverless-http";

// Vercel serverless function export
export const handler = serverless(app);

// For local testing (optional)
export default app;