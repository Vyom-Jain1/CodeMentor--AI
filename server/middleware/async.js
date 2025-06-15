const ErrorResponse = require("../utils/ErrorResponse");

const asyncHandler = (fn) => (req, res, next) => {
  const handleError = (error) => {
    // Handle specific error types
    if (error.name === "ValidationError") {
      return next(ErrorResponse.validationError(error.message, error.errors));
    }

    if (error.name === "CastError") {
      return next(ErrorResponse.badRequest("Invalid ID format"));
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(ErrorResponse.conflict(`Duplicate field value: ${field}`));
    }

    // Log unexpected errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in async handler:", error);
    }

    // Pass error to error handler
    return next(error);
  };

  // Execute function and catch any errors
  Promise.resolve(fn(req, res, next)).catch(handleError);
};

module.exports = asyncHandler;
