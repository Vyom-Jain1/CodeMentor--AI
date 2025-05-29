const express = require("express");
const router = express.Router();
const axios = require("axios");

// Initialize Ollama API configuration
const OLLAMA_API = process.env.OLLAMA_API || "http://localhost:11434/api";
const MODEL = process.env.OLLAMA_MODEL || "codellama";

// Test Ollama API
router.get("/test-ollama", async (req, res) => {
  try {
    const response = await axios.post(`${OLLAMA_API}/generate`, {
      model: MODEL,
      prompt: "Say 'Ollama API is working!'",
      stream: false,
    });

    res.json({
      success: true,
      message: response.data.response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
