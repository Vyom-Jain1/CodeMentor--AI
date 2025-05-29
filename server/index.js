const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const validateEnv = require("./config/env");
const asyncHandler = require("./middleware/async");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Environment variables loaded successfully");
  console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not Set");
}

// Validate environment variables
validateEnv();

// Connect to database (only in non-test environment)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const problemRoutes = require("./routes/problems");
const aiRoutes = require("./routes/ai");
const codeExecutionRoutes = require("./routes/codeExecution");
const testRoutes = require("./routes/test");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/code", codeExecutionRoutes);
app.use("/api/test", testRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Start server (only in non-test environment)
let server;
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    );
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle server shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      mongoose.connection.close(false, () => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
  });
}

module.exports = app;
