const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const apicache = require("apicache");

// Load environment variables first
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
<<<<<<< HEAD
  process.exit(1);
}

// Validate HF_API_KEY specifically
if (!process.env.HF_API_KEY) {
  console.error("ERROR: HF_API_KEY is not set in environment variables");
  process.exit(1);
} else {
  console.log("HF_API_KEY is properly set");
}

// Validate critical environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "HF_API_KEY", "PORT"];

const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env]);
if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
  process.exit(1);
}

console.log("Environment variables loaded successfully");
console.log("Server configuration:", {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: "Set",
  HF_API_KEY: process.env.HF_API_KEY ? "Set" : "Not Set",
  CORS_ORIGIN: process.env.CORS_ORIGIN,
});

// Validate environment variables
validateEnv();
=======
  console.log("Using default environment variables");
}

// Set default values for required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "5000";
process.env.JWT_SECRET = process.env.JWT_SECRET || "fallback-jwt-secret-key";
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || "30d";
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/codementor";
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813

// Connect to database (only in non-test environment)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Create Express app
const app = express();

<<<<<<< HEAD
// Configure trust proxy
app.set("trust proxy", 1); // Trust first proxy

// Middleware
// Configure CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
  })
);

// Configure request parsing
app.use(express.json({ limit: process.env.MAX_REQUEST_SIZE || "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.MAX_REQUEST_SIZE || "50mb",
  })
);

// Add logging in non-test environment
=======
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

>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Add compression and security headers
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

// Add rate limiting middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Add request caching
const cache = apicache.middleware;
app.use("/api/problems", cache("5 minutes"));

// Add security headers
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const problemRoutes = require("./routes/problems");
const aiRoutes = require("./routes/ai");
const analyzeRoutes = require("./routes/analyze");
const codeExecutionRoutes = require("./routes/codeExecution");
const progressRoutes = require("./routes/progress");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analyze", analyzeRoutes);
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

<<<<<<< HEAD
  // Create HTTP server
  server = require("http").createServer(app);

  // Initialize Socket.IO
=======
  // Socket.io Real-time Collaboration
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
  const { Server } = require("socket.io");
  const io = new Server(server, {
    path: "/socket.io",
    cors: {
<<<<<<< HEAD
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
=======
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ["GET", "POST"],
      credentials: true
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
    },
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
    transports: ["polling", "websocket"],
    allowEIO3: true,
    maxHttpBufferSize: 1e8, // 100 MB
  });

  // Socket.IO event handlers
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

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  // Debug WebSocket connections
  io.engine.on("connection_error", (err) => {
    console.log("Socket.io connection error:", err);
  });

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket server is ready`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });

  // Handle server errors
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
    } else {
      console.error("Server error:", error);
    }
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! Shutting down...");
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