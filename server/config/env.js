const validateEnv = () => {
  const requiredEnvVars = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_API_URL:
      process.env.OPENAI_API_URL ||
      "https://api.openai.com/v1/chat/completions",
    OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("Error: Missing required environment variables:");
    missingVars.forEach((variable) => {
      console.error(`  - ${variable}`);
    });
    process.exit(1);
  }

  // Set validated environment variables
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    process.env[key] = value;
  });

  // Rate limiting configuration
  process.env.RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW || "60000";
  process.env.RATE_LIMIT_MAX_REQUESTS =
    process.env.RATE_LIMIT_MAX_REQUESTS || "20";
};

module.exports = validateEnv;
