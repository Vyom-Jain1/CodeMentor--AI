const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const validateEnv = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const compression = require("compression");
const helmet = require("helmet");

// Load environment variables
try {
  require("dotenv").config();

  // Check required environment variables
  const required = [
    "NODE_ENV",
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "HF_API_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    process.exit(1);
  }

  console.log("Environment variables loaded successfully");
} catch (error) {
  console.error("Error loading environment variables:", error);
  process.exit(1);
}

console.log("Environment file loaded. Current environment variables:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "[SET]" : "[NOT SET]");
console.log("HF_API_KEY:", process.env.HF_API_KEY ? "[SET]" : "[NOT SET]");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "[SET]" : "[NOT SET]");

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

// Validate environment variables
validateEnv();

// Create Express app
const app = express();

// Enable trust proxy if behind a proxy
app.enable("trust proxy");

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN
        : ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: process.env.MAX_REQUEST_SIZE || "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.MAX_REQUEST_SIZE || "50mb",
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(compression());
app.use(helmet());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const problemRoutes = require("./routes/problems");
const aiRoutes = require("./routes/ai");
const analyzeRoutes = require("./routes/analyze");
const codeExecutionRoutes = require("./routes/codeExecution");
const testRoutes = require("./routes/test");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/code", codeExecutionRoutes);
app.use("/api/test", testRoutes);

// Add rate limiting
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
});
app.use("/api/", limiter);

// Add caching
const apicache = require("apicache");
const cache = apicache.middleware;
app.use("/api/problems", cache("5 minutes"));

// Add security headers
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());

// Error handling middleware
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Start server
let server;
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;

  // Connect to MongoDB
  connectDB()
    .then(() => {
      console.log("MongoDB connected successfully");

      // Create HTTP server
      server = require("http").createServer(app);

      // Initialize Socket.IO
      const { Server } = require("socket.io");
      const io = new Server(server, {
        path: "/socket.io",
        cors: {
          origin: process.env.CORS_ORIGIN || "http://localhost:3000",
          methods: ["GET", "POST", "OPTIONS"],
          credentials: true,
          allowedHeaders: ["Authorization", "Content-Type"],
        },
        pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
        pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
        transports: ["polling", "websocket"],
        allowEIO3: true,
        maxHttpBufferSize: 1e8,
      });

      // Socket.IO event handlers
      io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

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
          console.log("User disconnected:", socket.id);
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
      server.listen(PORT, "0.0.0.0", () => {
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
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      process.exit(1);
    });
}

module.exports = app;
