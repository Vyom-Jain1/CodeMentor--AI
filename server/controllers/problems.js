const Problem = require("../models/Problem");
const User = require("../models/User");

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
exports.getProblems = async (req, res) => {
  try {
    const { difficulty, category, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const problems = await Problem.find(query)
      .select("-solution -testCases")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ order: 1, createdAt: -1 });

    const count = await Problem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: problems.length,
      total: count,
      data: problems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        hasNext: parseInt(page) < Math.ceil(count / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (err) {
    console.error('Get problems error:', err);
    res.status(500).json({
      success: false,
      error: "Error fetching problems",
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
    console.error('Get problem error:', err);
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }
    res.status(500).json({
      success: false,
      error: "Error fetching problem",
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
    console.error('Create problem error:', err);
    res.status(500).json({
      success: false,
      error: "Error creating problem",
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
    console.error('Update problem error:', err);
    res.status(500).json({
      success: false,
      error: "Error updating problem",
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

    await Problem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error('Delete problem error:', err);
    res.status(500).json({
      success: false,
      error: "Error deleting problem",
    });
  }
};

// @desc    Submit solution
// @route   POST /api/problems/:id/submit
// @access  Private
exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: "Code and language are required",
      });
    }

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    // Simple validation - in a real app, you'd run the code against test cases
    const submission = {
      user: req.user.id,
      code,
      language,
      status: "accepted", // This should be determined by actual code execution
      submittedAt: Date.now(),
    };

    // Update user progress if submission is accepted
    if (submission.status === "accepted") {
      const user = await User.findById(req.user.id);
      if (!user.progress.completedProblems.includes(problem._id)) {
        user.progress.completedProblems.push(problem._id);
        user.progress.points += 10; // Base points
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        status: submission.status,
        message: submission.status === "accepted" ? "Solution accepted!" : "Solution needs improvement",
        results: [
          {
            input: "Sample input",
            expectedOutput: "Sample output",
            actualOutput: "Sample output",
            passed: true,
          }
        ],
        allPassed: submission.status === "accepted",
      },
    });
  } catch (err) {
    console.error('Submit solution error:', err);
    res.status(500).json({
      success: false,
      error: "Error submitting solution",
    });
  }
};

// @desc    Get problems by topic
// @route   GET /api/problems/topic/:topic
// @access  Public
exports.getProblemsByTopic = async (req, res) => {
  try {
    const problems = await Problem.find({ topic: req.params.topic })
      .select("-solution -testCases")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (err) {
    console.error('Get problems by topic error:', err);
    res.status(500).json({
      success: false,
      error: "Error fetching problems by topic",
    });
  }
};

// @desc    Get problems by category
// @route   GET /api/problems/category/:category
// @access  Public
exports.getProblemsByCategory = async (req, res) => {
  try {
    const problems = await Problem.find({ category: req.params.category })
      .select("-solution -testCases")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (err) {
    console.error('Get problems by category error:', err);
    res.status(500).json({
      success: false,
      error: "Error fetching problems by category",
    });
  }
};

// @desc    Get all topics
// @route   GET /api/problems/topics
// @access  Public
exports.getTopics = async (req, res) => {
  try {
    const topics = await Problem.distinct("topic");

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (err) {
    console.error('Get topics error:', err);
    res.status(500).json({
      success: false,
      error: "Error fetching topics",
    });
  }
};

// @desc    Get all categories
// @route   GET /api/problems/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Problem.distinct("category");

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({
      success: false,
      error: "Error fetching categories",
    });
  }
};