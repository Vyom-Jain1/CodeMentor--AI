const Problem = require("../models/Problem");
const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Discussion = require("../models/Discussion");

// @desc    Get all problems
// @route   GET /api/v1/problems
// @access  Public
exports.getProblems = asyncHandler(async (req, res, next) => {
  const { category, topic, difficulty, search } = req.query;

  // Build query
  const query = {};

  if (category) {
    query.category = category;
  }

  if (topic) {
    query.topic = topic;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Execute query
  const problems = await Problem.find(query).sort("order");

  res.status(200).json({
    success: true,
    count: problems.length,
    data: problems,
  });
});

// @desc    Get single problem
// @route   GET /api/v1/problems/:id
// @access  Public
exports.getProblem = asyncHandler(async (req, res, next) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    return next(
      new ErrorResponse(`Problem not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: problem,
  });
});

// @desc    Create new problem
// @route   POST /api/v1/problems
// @access  Private/Admin
exports.createProblem = asyncHandler(async (req, res, next) => {
  const problem = await Problem.create(req.body);

  res.status(201).json({
    success: true,
    data: problem,
  });
});

// @desc    Update problem
// @route   PUT /api/v1/problems/:id
// @access  Private/Admin
exports.updateProblem = asyncHandler(async (req, res, next) => {
  let problem = await Problem.findById(req.params.id);

  if (!problem) {
    return next(
      new ErrorResponse(`Problem not found with id of ${req.params.id}`, 404)
    );
  }

  problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: problem,
  });
});

// @desc    Delete problem
// @route   DELETE /api/v1/problems/:id
// @access  Private/Admin
exports.deleteProblem = asyncHandler(async (req, res, next) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem) {
    return next(
      new ErrorResponse(`Problem not found with id of ${req.params.id}`, 404)
    );
  }

  await problem.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get problems by topic
// @route   GET /api/v1/problems/topic/:topic
// @access  Public
exports.getProblemsByTopic = asyncHandler(async (req, res, next) => {
  const problems = await Problem.find({ topic: req.params.topic }).sort(
    "order"
  );

  res.status(200).json({
    success: true,
    count: problems.length,
    data: problems,
  });
});

// @desc    Get problems by category
// @route   GET /api/v1/problems/category/:category
// @access  Public
exports.getProblemsByCategory = asyncHandler(async (req, res, next) => {
  const problems = await Problem.find({ category: req.params.category }).sort(
    "order"
  );

  res.status(200).json({
    success: true,
    count: problems.length,
    data: problems,
  });
});

// @desc    Get all topics
// @route   GET /api/v1/problems/topics
// @access  Public
exports.getTopics = asyncHandler(async (req, res, next) => {
  const topics = await Problem.distinct("topic");

  res.status(200).json({
    success: true,
    count: topics.length,
    data: topics,
  });
});

// @desc    Get all categories
// @route   GET /api/v1/problems/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Problem.distinct("category");

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// Submit solution
exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Add submission to problem
    problem.submissions.push({
      user: req.user._id,
      code,
      language,
      status: "accepted", // This would be determined by actual code execution
    });

    await problem.save();

    // Update user progress
    if (!req.user.progress.completedProblems.includes(problem._id)) {
      req.user.progress.completedProblems.push(problem._id);
      req.user.progress.points += 10; // Points for completing problem
      await req.user.save();
    }

    res.json({ message: "Solution submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get discussions for a problem
// @route   GET /api/problems/:id/discussions
// @access  Public
exports.getDiscussions = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found" });
    }

    const discussions = await Discussion.find({ problem: req.params.id })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(discussions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a discussion for a problem
// @route   POST /api/problems/:id/discussions
// @access  Private
exports.createDiscussion = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found" });
    }

    const newDiscussion = new Discussion({
      content: req.body.content,
      user: req.user.id,
      problem: req.params.id,
    });

    const discussion = await newDiscussion.save();
    await discussion.populate("user", "username");

    res.json(discussion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
