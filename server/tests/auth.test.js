const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");

describe("Auth Endpoints", () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      console.error("MongoDB connection failed:", err);
      throw err;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    } catch (err) {
      console.error("MongoDB cleanup failed:", err);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("name", "Test User");
    });

    it("should not register user with existing email", async () => {
      await User.create({
        name: "Existing User",
        email: "test@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should login existing user", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("name", "Test User");
    });

    it("should not login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error");
    });
  });
});
