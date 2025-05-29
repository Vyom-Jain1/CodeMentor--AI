const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Problem = require("../models/Problem");
const User = require("../models/User");
const axios = require("axios");

// Mock axios
jest.mock("axios");

let token;
let problemId;

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
});

beforeEach(async () => {
  try {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock successful OpenAI API response
    axios.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: "Test response from OpenAI",
            },
          },
        ],
      },
    });

    // Clean up the database before each test
    await User.deleteMany({});
    await Problem.deleteMany({});

    // Create test user and get token
    const testUser = await User.create({
      name: "AI Test User",
      email: "aitest@example.com",
      password: "password123",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "aitest@example.com",
      password: "password123",
    });

    token = loginResponse.body.token;

    // Create test problem
    const problem = await Problem.create({
      title: "Test Problem",
      description: "Test description",
      difficulty: "easy",
      category: "Arrays",
      topic: "Arrays",
      order: 1,
    });

    problemId = problem._id;
  } catch (err) {
    console.error("Test setup failed:", err);
    throw err;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  } catch (err) {
    console.error("Test cleanup failed:", err);
  }
});

describe("AI Controller & Rate Limiter Tests", () => {
  describe("AI Endpoints", () => {
    it("should get a hint for a problem", async () => {
      const response = await request(app)
        .get(`/api/ai/hint/${problemId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data", "Test response from OpenAI");
      expect(axios.post).toHaveBeenCalled();
    });

    it("should explain code", async () => {
      const response = await request(app)
        .post(`/api/ai/explain/${problemId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          code: "function sum(a, b) { return a + b; }",
          language: "javascript",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data", "Test response from OpenAI");
      expect(axios.post).toHaveBeenCalled();
    });

    it("should validate input for explain endpoint", async () => {
      const response = await request(app)
        .post(`/api/ai/explain/${problemId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          code: "",
          language: "invalid",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });

    it("should handle OpenAI API errors", async () => {
      // Mock API error
      axios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { error: { message: "OpenAI API Error" } },
        },
      });

      const response = await request(app)
        .get(`/api/ai/hint/${problemId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body.error).toContain("OpenAI API Error");
    });
  });

  describe("Rate Limiter", () => {
    it("should allow requests within rate limit", async () => {
      const response = await request(app)
        .get(`/api/ai/hint/${problemId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty("x-ratelimit-limit");
      expect(response.headers).toHaveProperty("x-ratelimit-remaining");
      expect(response.headers).toHaveProperty("x-ratelimit-reset");
    });

    it("should block requests when rate limit is exceeded", async () => {
      // Make multiple requests to exceed rate limit
      const requests = Array(100) // Increased from 25 to 100
        .fill()
        .map(() =>
          request(app)
            .get(`/api/ai/hint/${problemId}`)
            .set("Authorization", `Bearer ${token}`)
        );

      const responses = await Promise.all(requests);
      const blockedResponses = responses.filter((r) => r.status === 429);

      expect(blockedResponses.length).toBeGreaterThan(0);
      expect(blockedResponses[0].body).toHaveProperty("error");
    });
  });

  describe("Environment Variables", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should validate required environment variables", () => {
      // Save the original process.exit
      const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

      // Delete a required env var
      delete process.env.OPENAI_API_KEY;

      // Require the env validation module
      const validateEnv = require("../config/env");

      // Run validation
      validateEnv();

      // Check if process.exit was called with 1
      expect(mockExit).toHaveBeenCalledWith(1);

      // Restore process.exit
      mockExit.mockRestore();
    });
  });
});
