import mongoose from "mongoose";

let connection = null;

// Connects once and reuses the same connection (important on Vercel)
export function connectDB() {
  if (!process.env.MONGODB_URL) {
    return Promise.reject(new Error("MONGODB_URL is missing. Add it to .env (local) or Vercel Environment Variables."));
  }
  if (!connection) {
    connection = mongoose
      .connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 10000 })
      .catch((error) => {
        connection = null;
        throw error;
      });
  }
  return connection;
}
