const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  executeCode,
  getSupportedLanguages,
} = require("../controllers/codeExecution");

// @route   GET /api/code/languages
// @desc    Get supported programming languages
// @access  Public
router.get("/languages", getSupportedLanguages);

// @route   POST /api/code/execute
// @desc    Execute code and validate against test cases
// @access  Private
router.post("/execute", protect, executeCode);

module.exports = router;
