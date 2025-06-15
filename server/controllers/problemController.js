const Problem = require("../models/Problem");
const { validationResult } = require("express-validator");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const Discussion = require("../models/Discussion");

const handleError = (res, error, message) => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({
    success: false,
    error: message,
  });
};

// @desc    Get all problems
// @route   GET /api/v1/problems
// @access  Public
exports.getAllProblems = async (req, res) => {
  try {
    const {
      difficulty,
      category,
      topic,
      company,
      source,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({
        success: false,
        error: "Invalid pagination parameters",
      });
    }

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (topic) query.topic = topic;
    if (company) query.companies = company;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Problem.countDocuments(query);

    res.json({
      success: true,
      data: problems,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error in getAllProblems:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching problems",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get single problem
// @route   GET /api/v1/problems/:id
// @access  Public
exports.getProblem = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        error: "Problem ID is required",
      });
    }

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: `Problem not found with id: ${req.params.id}`,
      });
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error("Error in getProblem:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid problem ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Error fetching problem",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Create new problem
// @route   POST /api/v1/problems
// @access  Private/Admin
exports.createProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.create(req.body);
  res.status(201).json({
    success: true,
    data: problem,
  });
});

// @desc    Update problem
// @route   PUT /api/v1/problems/:id
// @access  Private/Admin
exports.updateProblem = asyncHandler(async (req, res) => {
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
exports.deleteProblem = asyncHandler(async (req, res) => {
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
exports.getProblemsByTopic = async (req, res) => {
  try {
    const problems = await Problem.find({ topic: req.params.topic });
    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    handleError(res, error, "Error fetching problems by topic");
  }
};

// @desc    Get problems by company
// @route   GET /api/v1/problems/company/:company
// @access  Public
exports.getProblemsByCompany = async (req, res) => {
  try {
    const problems = await Problem.find({ companies: req.params.company });
    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    handleError(res, error, "Error fetching problems by company");
  }
};

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
exports.getTopics = async (req, res) => {
  try {
    const topics = await Problem.distinct("topic");
    res.json({
      success: true,
      data: topics,
    });
  } catch (error) {
    handleError(res, error, "Error fetching topics");
  }
};

// @desc    Get all companies
// @route   GET /api/v1/problems/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Problem.distinct("companies");
    res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    handleError(res, error, "Error fetching companies");
  }
};

// Submit solution
exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    problem.submissions.push({
      user: req.user._id,
      code,
      language,
      status: "accepted",
    });

    await problem.save();

    if (!req.user.progress.completedProblems.includes(problem._id)) {
      req.user.progress.completedProblems.push(problem._id);
      req.user.progress.points += 10;
      await req.user.save();
    }

    res.json({ message: "Solution submitted successfully" });
  } catch (error) {
    handleError(res, error, "Error submitting solution");
  }
};

// @desc    Get discussions (general or for a specific problem)
// @route   GET /api/v1/problems/discussions or /api/v1/problems/:id/discussions
// @access  Public
exports.getDiscussions = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "latest" } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (req.params.id) {
      query.problem = req.params.id;
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case "latest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        sortOptions = { likes: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const discussions = await Discussion.find(query)
      .populate("user", "name avatar")
      .populate("problem", "title")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Discussion.countDocuments(query);

    res.json({
      success: true,
      data: {
        discussions,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    handleError(res, error, "Error fetching discussions");
  }
};

// @desc    Create a discussion for a problem or general discussion
// @route   POST /api/problems/:id/discussions or /api/problems/discussions
// @access  Private
exports.createDiscussion = async (req, res) => {
  try {
    const { content } = req.body;
    const problemId = req.params.id;

    if (problemId) {
      const problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ msg: "Problem not found" });
      }
    }

    const newDiscussion = new Discussion({
      content,
      user: req.user.id,
      problem: problemId,
    });

    const discussion = await newDiscussion.save();
    await discussion.populate("user", "username avatar");
    if (problemId) {
      await discussion.populate("problem", "title");
    }

    res.json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    handleError(res, error, "Error creating discussion");
  }
};

// @desc    Like a discussion
// @route   POST /api/problems/discussions/:id/like
// @access  Private
exports.likeDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    // Check if user has already liked the discussion
    if (discussion.likedBy.includes(req.user.id)) {
      return res.status(400).json({ msg: "Discussion already liked" });
    }

    discussion.likes += 1;
    discussion.likedBy.push(req.user.id);
    await discussion.save();

    res.json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    handleError(res, error, "Error liking discussion");
  }
};

// @desc    Reply to a discussion
// @route   POST /api/problems/discussions/:id/replies
// @access  Private
exports.replyToDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ msg: "Discussion not found" });
    }

    const reply = {
      content: req.body.content,
      user: req.user.id,
      createdAt: Date.now(),
    };

    discussion.replies.push(reply);
    await discussion.save();

    // Populate user info for the reply
    await discussion.populate("replies.user", "username avatar");

    res.json({
      success: true,
      data: discussion.replies[discussion.replies.length - 1],
    });
  } catch (error) {
    handleError(res, error, "Error replying to discussion");
  }
};
