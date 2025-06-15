const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error({
    error: err,
    requestId: req.id,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : "unauthenticated",
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Express validator errors
  if (err.array) {
    const message = err.array().map((err) => err.msg);
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ErrorResponse("Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new ErrorResponse("Token expired", 401);
  }

  // AI Provider errors
  if (err.name === "AIProviderError") {
    error = new ErrorResponse("AI service temporarily unavailable", 503);
  }

  // Rate limit exceeded
  if (err.type === "TooManyRequests") {
    const message = "Rate limit exceeded. Please try again later";
    error = new ErrorResponse(message, 429);
  }

  // File upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File size too large";
    error = new ErrorResponse(message, 400);
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Invalid file type";
    error = new ErrorResponse(message, 400);
  }

  // Socket.IO errors
  if (err.type === "TransportError") {
    const message = "Connection error. Please check your network";
    error = new ErrorResponse(message, 503);
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    error: {
      message: error.message || "Server Error",
      code: error.code || "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
        details: err.details || null,
      }),
    },
  };

  // Add request ID if available
  if (req.id) {
    response.error.requestId = req.id;
  }

  // Log error metrics (in production)
  if (process.env.NODE_ENV === "production") {
    // Here you could add error monitoring service integration
    // e.g., Sentry, New Relic, etc.
    console.error({
      timestamp: new Date().toISOString(),
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      errorCode: error.code,
      errorMessage: error.message,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    });
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
