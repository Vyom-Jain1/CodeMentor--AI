const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getAllProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  submitSolution,
  getProblemsByTopic,
  getProblemsByCompany,
  getTopics,
  getCompanies,
  getDiscussions,
  createDiscussion,
  likeDiscussion,
  replyToDiscussion,
} = require("../controllers/problemController");
const { protect, authorize } = require("../middleware/auth");

const problemValidation = [
  check("title", "Title is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("difficulty", "Difficulty is required").isIn([
    "easy",
    "medium",
    "hard",
  ]),
  check("category", "Category is required").isIn([
    "arrays",
    "strings",
    "linked-lists",
    "trees",
    "graphs",
    "dynamic-programming",
    "sorting",
    "searching",
  ]),
];

// @route   GET api/problems
// @desc    Get all problems
// @access  Public
router.get("/", getAllProblems);

// @route   GET api/problems/topics
// @desc    Get all topics
// @access  Public
router.get("/topics", getTopics);

// @route   GET api/problems/companies
// @desc    Get all companies
// @access  Public
router.get("/companies", getCompanies);

// @route   GET api/problems/topic/:topic
// @desc    Get problems by topic
// @access  Public
router.get("/topic/:topic", getProblemsByTopic);

// @route   GET api/problems/company/:company
// @desc    Get problems by company
// @access  Public
router.get("/company/:company", getProblemsByCompany);

// @route   GET api/problems/discussions
// @desc    Get all discussions
// @access  Public
router.get("/discussions", getDiscussions);

// @route   POST api/problems/discussions
// @desc    Create a general discussion
// @access  Private
router.post(
  "/discussions",
  protect,
  [check("content", "Content is required").not().isEmpty()],
  createDiscussion
);

// @route   POST api/problems/discussions/:id/like
// @desc    Like a discussion
// @access  Private
router.post("/discussions/:id/like", protect, likeDiscussion);

// @route   POST api/problems/discussions/:id/replies
// @desc    Reply to a discussion
// @access  Private
router.post(
  "/discussions/:id/replies",
  protect,
  [check("content", "Content is required").not().isEmpty()],
  replyToDiscussion
);

// @route   GET api/problems/:id/discussions
// @desc    Get discussions for a problem
// @access  Public
router.get("/:id/discussions", getDiscussions);

// @route   POST api/problems/:id/discussions
// @desc    Create a discussion for a problem
// @access  Private
router.post(
  "/:id/discussions",
  protect,
  [check("content", "Content is required").not().isEmpty()],
  createDiscussion
);

// @route   GET api/problems/:id
// @desc    Get single problem
// @access  Public
router.get("/:id", getProblem);

// @route   POST api/problems
// @desc    Create problem
// @access  Private/Admin
router.post("/", protect, authorize("admin"), problemValidation, createProblem);

// @route   PUT api/problems/:id
// @desc    Update problem
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  problemValidation,
  updateProblem
);

// @route   DELETE api/problems/:id
// @desc    Delete problem
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), deleteProblem);

// @route   POST api/problems/:id/submit
// @desc    Submit solution
// @access  Private
router.post(
  "/:id/submit",
  protect,
  [
    check("code", "Code is required").not().isEmpty(),
    check("language", "Language is required").not().isEmpty(),
  ],
  submitSolution
);

module.exports = router;
