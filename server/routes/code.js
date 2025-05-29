const express = require("express");
const router = express.Router();
const codeRunner = require("../services/codeRunner");
const { protect } = require("../middleware/auth");

// Initialize code runner
codeRunner.initialize().catch(console.error);

// @desc    Execute code
// @route   POST /api/code/run
// @access  Private
router.post("/run", protect, async (req, res) => {
  try {
    const { code, language, input, environment } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Please provide both code and language",
      });
    }

    const result = await codeRunner.runCode(code, language, input, environment);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error executing code",
    });
  }
});

// @desc    Submit solution for a problem
// @route   POST /api/code/submit/:problemId
// @access  Private
router.post("/submit/:problemId", protect, async (req, res) => {
  try {
    const { code, language } = req.body;
    const { problemId } = req.params;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Please provide both code and language",
      });
    }

    // Get problem test cases
    const Problem = require("../models/Problem");
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    // Run code against all test cases
    const results = [];
    for (const testCase of problem.testCases) {
      const result = await codeRunner.runCode(code, language, testCase.input);

      const passed = result.stdout.trim() === testCase.output.trim();
      results.push({
        input: testCase.isHidden ? "Hidden" : testCase.input,
        expectedOutput: testCase.isHidden ? "Hidden" : testCase.output,
        actualOutput: result.stdout,
        passed,
      });
    }

    // Check if all test cases passed
    const allPassed = results.every((r) => r.passed);
    if (allPassed) {
      // Update user progress
      const User = require("../models/User");
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: {
          "progress.completedProblems": problemId,
        },
        $inc: {
          "progress.points":
            problem.difficulty === "easy"
              ? 1
              : problem.difficulty === "medium"
              ? 2
              : 3,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        results,
        allPassed,
      },
    });
  } catch (error) {
    console.error("Solution submission error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error submitting solution",
    });
  }
});

module.exports = router;
