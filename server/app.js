import express from "express";
import studentRoutes from "./routes/studentRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

// Open /api/health to check if the API and database are working
app.get("/api/health", async (_req, res) => {
  try {
    await connectDB();
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "not connected", message: error.message });
  }
});

// Connect to MongoDB before any student request
app.use(
  "/api/students",
  async (_req, _res, next) => {
    await connectDB();
    next();
  },
  studentRoutes
);

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err, _req, res, _next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(". ") });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "A student with this email already exists." });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must be valid JSON." });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ message: err.message || "Something went wrong on the server." });
});

export default app;
