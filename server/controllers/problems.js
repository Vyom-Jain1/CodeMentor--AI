const Problem = require("../models/Problem");
const User = require("../models/User");

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
exports.getProblems = async (req, res) => {
  try {
    const { difficulty, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const problems = await Problem.find(query)
      .select("-solution -testCases")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Problem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: problems,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Public
exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("-solution");

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private/Admin
exports.createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);

    res.status(201).json({
      success: true,
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private/Admin
exports.updateProblem = async (req, res) => {
  try {
    let problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private/Admin
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    await problem.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @desc    Submit solution
// @route   POST /api/problems/:id/submit
// @access  Private
exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    // TODO: Implement code execution and testing
    // This is a placeholder for the actual code execution logic
    const submission = {
      user: req.user.id,
      code,
      language,
      status: "accepted", // This should be determined by actual code execution
      submittedAt: Date.now(),
    };

    problem.submissions.push(submission);
    await problem.save();

    // Update user progress if submission is accepted
    if (submission.status === "accepted") {
      const user = await User.findById(req.user.id);
      if (!user.progress.completedProblems.includes(problem._id)) {
        user.progress.completedProblems.push(problem._id);
        user.progress.points += problem.points;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
