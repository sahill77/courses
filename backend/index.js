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

// CORS Configuration
const allowedOrigins = [
  "https://courses-fr.vercel.app",
  "http://localhost:5173",
  "http://localhost:5000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes - MUST come before static file serving
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

// Serve static files from the React app (Production Build)
// This should come AFTER all API routes
const frontendDistPath = path.join(__dirname, "../frontend/dist");

// Check if dist folder exists
import fs from 'fs';
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  
  // The "catchall" handler: for any request that doesn't match API routes,
  // send back React's index.html file.
  app.use((req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
  
  console.log(`✓ Serving frontend from: ${frontendDistPath}`);
} else {
  // If dist doesn't exist, show a helpful message
  app.use((req, res) => {
    res.status(503).send(`
      <html>
        <head><title>Build Required</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1>⚠️ Frontend Build Not Found</h1>
          <p>Please build the frontend first:</p>
          <pre style="background: #f4f4f4; padding: 20px; border-radius: 8px; display: inline-block;">
cd frontend
npm run build
          </pre>
          <p>Then restart the server.</p>
        </body>
      </html>
    `);
  });
  
  console.log(`⚠ Frontend build not found at: ${frontendDistPath}`);
  console.log(`⚠ Please run: npm run build --prefix frontend`);
}

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads\n`);
});
