const express = require("express");
const router = express.Router();
const {
  getHint,
  explainCode,
  optimizeCode,
  getSolution,
  getGuidance,
  visualizeCode,
  getOllamaResponse,
  chat,
} = require("../controllers/ai");
const { protect } = require("../middleware/auth");
const rateLimiter = require("../middleware/rateLimiter");

// All routes are protected and rate limited
router.use(protect);
router.use(rateLimiter);

// AI assistance routes
router.get("/hint/:problemId", getHint);
router.post("/explain/:problemId", explainCode);
router.post("/optimize/:problemId", optimizeCode);
router.get("/solution/:problemId", getSolution);
router.get("/guidance/:problemId", getGuidance);
router.post("/visualize/:problemId", visualizeCode);
router.post("/ollama", getOllamaResponse);
router.post("/chat", chat);

module.exports = router;
