import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import adminRoutes from "./routes/admin.js";
import helpRoutes from "./routes/help.js";
import categoryRoutes from "./routes/categories.js";
import uploadRoutes from "./routes/upload.js";
import instructorRoutes from "./routes/instructor.js";
import paymentRoutes from "./routes/payment.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "https://courses-fr.vercel.app",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/payments", paymentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle React routing - return index.html for all non-API routes
app.use((req, res, next) => {
  // If the request is not for an API route, serve index.html
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
