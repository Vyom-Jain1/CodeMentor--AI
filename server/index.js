const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");

// Load environment variables first
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
  console.log("Using default environment variables");
}

// Set default values for required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "5000";
process.env.JWT_SECRET = process.env.JWT_SECRET || "fallback-jwt-secret-key";
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codementor";

// Connect to database (only in non-test environment)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Create Express app
const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(compression());
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const problemRoutes = require("./routes/problems");
const aiRoutes = require("./routes/ai");
const codeExecutionRoutes = require("./routes/codeExecution");
const progressRoutes = require("./routes/progress");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/code", codeExecutionRoutes);
app.use("/api/progress", progressRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

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

  // Socket.io Real-time Collaboration
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("userJoined", socket.id);
    });

    socket.on("codeChange", ({ roomId, code }) => {
      socket.to(roomId).emit("codeUpdate", code);
    });

    socket.on("chatMessage", ({ roomId, message }) => {
      socket.to(roomId).emit("chatMessage", { user: socket.id, message });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected: " + socket.id);
    });
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