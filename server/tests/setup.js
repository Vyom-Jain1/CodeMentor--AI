// Set test environment
process.env.NODE_ENV = "test";

// Set required environment variables for testing
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRE = "1h";
process.env.OPENAI_API_KEY = "test-openai-key";
process.env.RATE_LIMIT_WINDOW = "5000"; // 5 seconds for testing
process.env.RATE_LIMIT_MAX_REQUESTS = "50"; // 50 requests per 5 seconds for testing
process.env.MONGO_URI = "mongodb://localhost:27017/codementor-test";

// Mock console methods
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

Object.assign(console, mockConsole);

// Handle MongoDB Memory Server cleanup
process.env.MONGOMS_DOWNLOAD_URL =
  "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.4.1.tgz";
process.env.MONGOMS_VERSION = "4.4.1";
