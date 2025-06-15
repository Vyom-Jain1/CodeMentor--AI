const logger = require("../utils/logger");

const validateEnv = () => {
  const requiredEnvVars = {
    MONGO_URI: {
      type: "string",
      required: true,
      description: "MongoDB connection string",
    },
    JWT_SECRET: {
      type: "string",
      required: true,
      description: "Secret key for JWT token generation",
    },
    JWT_EXPIRE: {
      type: "string",
      required: false,
      default: "30d",
      description: "JWT token expiration time",
    },
    PORT: {
      type: "number",
      required: false,
      default: 5000,
      description: "Server port number",
    },
    NODE_ENV: {
      type: "string",
      required: false,
      default: "development",
      enum: ["development", "production", "test"],
      description: "Node environment",
    },
    HF_API_KEY: {
      type: "string",
      required: true,
      description: "Hugging Face API key",
    },
    HF_API_URL: {
      type: "string",
      required: false,
      default: "https://api-inference.huggingface.co/models/bigcode/starcoder",
      description: "Hugging Face API URL",
    },
    CORS_ORIGIN: {
      type: "string",
      required: false,
      default: "http://localhost:3000",
      description: "CORS origin URL",
    },
    RATE_LIMIT_WINDOW: {
      type: "number",
      required: false,
      default: 60000,
      description: "Rate limit window in milliseconds",
    },
    RATE_LIMIT_MAX_REQUESTS: {
      type: "number",
      required: false,
      default: 100,
      description: "Maximum requests per rate limit window",
    },
    MAX_REQUEST_SIZE: {
      type: "string",
      required: false,
      default: "50mb",
      description: "Maximum request size",
    },
    SOCKET_PING_TIMEOUT: {
      type: "number",
      required: false,
      default: 60000,
      description: "Socket.IO ping timeout in milliseconds",
    },
    SOCKET_PING_INTERVAL: {
      type: "number",
      required: false,
      default: 25000,
      description: "Socket.IO ping interval in milliseconds",
    },
    CACHE_ENABLED: {
      type: "boolean",
      required: false,
      default: true,
      description: "Enable API response caching",
    },
    CACHE_DURATION: {
      type: "number",
      required: false,
      default: 300,
      description: "Cache duration in seconds",
    },
    SECURE_COOKIES: {
      type: "boolean",
      required: false,
      default: process.env.NODE_ENV === "production",
      description: "Enable secure cookies",
    },
  };

  const errors = [];
  const warnings = [];

  // Validate each environment variable
  Object.entries(requiredEnvVars).forEach(([key, config]) => {
    const value = process.env[key];

    // Check required variables
    if (config.required && !value) {
      errors.push(`Missing required environment variable: ${key}`);
      return;
    }

    // Set default value if not provided
    if (!value && config.default !== undefined) {
      process.env[key] = config.default;
      if (process.env.NODE_ENV === "development") {
        logger.debug(`Using default value for ${key}: ${config.default}`);
      }
      return;
    }

    // Type validation
    if (value) {
      switch (config.type) {
        case "number":
          if (isNaN(Number(value))) {
            errors.push(`Invalid number for ${key}: ${value}`);
          }
          break;
        case "boolean":
          if (!["true", "false"].includes(value.toLowerCase())) {
            errors.push(`Invalid boolean for ${key}: ${value}`);
          }
          break;
        case "string":
          if (config.enum && !config.enum.includes(value)) {
            errors.push(
              `Invalid value for ${key}: ${value}. Must be one of: ${config.enum.join(", ")}`
            );
          }
          break;
      }
    }
  });

  // Log warnings only in development
  if (process.env.NODE_ENV === "development" && warnings.length > 0) {
    logger.debug("Environment configuration notes:");
    warnings.forEach((warning) => logger.debug(`- ${warning}`));
  }

  // If there are validation errors, log them and exit
  if (errors.length > 0) {
    logger.error("Environment validation failed:");
    errors.forEach((error) => logger.error(`- ${error}`));
    process.exit(1);
  }

  // Log successful configuration
  logger.info("Environment configuration validated successfully");
  logger.debug("Active configuration:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE,
    CACHE_ENABLED: process.env.CACHE_ENABLED,
    CACHE_DURATION: process.env.CACHE_DURATION,
  });
};

module.exports = validateEnv;
