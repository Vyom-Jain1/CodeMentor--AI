const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("progress")
      .populate("progress.completedProblems");

    res.status(200).json({
      success: true,
      data: user.progress,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching user progress",
    });
  }
});

// @desc    Update user progress
// @route   PUT /api/progress
// @access  Private
router.put("/", protect, async (req, res) => {
  try {
    const { completedProblems, currentLevel, points } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update progress
    if (completedProblems) {
      user.progress.completedProblems = completedProblems;
    }
    if (currentLevel) {
      user.progress.currentLevel = currentLevel;
    }
    if (points) {
      user.progress.points = points;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.progress,
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
    res.status(500).json({
      success: false,
      error: "Error updating user progress",
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/progress/stats
// @access  Private
router.get("/stats", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("progress")
      .populate("progress.completedProblems");

    const stats = {
      totalSolved: user.progress.completedProblems.length,
      byDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      byCategory: {},
      points: user.progress.points,
      level: user.progress.currentLevel,
    };

    // Calculate statistics
    user.progress.completedProblems.forEach((problem) => {
      // Count by difficulty
      stats.byDifficulty[problem.difficulty]++;

      // Count by category
      if (!stats.byCategory[problem.category]) {
        stats.byCategory[problem.category] = 0;
      }
      stats.byCategory[problem.category]++;
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching user statistics",
    });
  }
});

module.exports = router;
