const express = require("express");
const router = express.Router();
const a2zCourse = require("../data/a2zCourse");

// @desc    Get the full A2Z DSA course structure
// @route   GET /api/a2z-course
// @access  Public
router.get("/", (req, res) => {
  res.json({ success: true, data: a2zCourse });
});

module.exports = router;
