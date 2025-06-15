const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  submitSolution,
  getProblemsByTopic,
  getProblemsByCategory,
  getTopics,
  getCategories,
  getDiscussions,
  createDiscussion,
} = require("../controllers/problemController");
const { protect, authorize } = require("../middleware/auth");

// @route   GET api/problems
// @desc    Get all problems
// @access  Public
router.get("/", getProblems);

// @route   GET api/problems/topics
// @desc    Get all topics
// @access  Public
router.get("/topics", getTopics);

// @route   GET api/problems/categories
// @desc    Get all categories
// @access  Public
router.get("/categories", getCategories);

// @route   GET api/problems/topic/:topic
// @desc    Get problems by topic
// @access  Public
router.get("/topic/:topic", getProblemsByTopic);

// @route   GET api/problems/category/:category
// @desc    Get problems by category
// @access  Public
router.get("/category/:category", getProblemsByCategory);

// @route   GET api/problems/:id
// @desc    Get single problem
// @access  Public
router.get("/:id", getProblem);

// @route   POST api/problems
// @desc    Create problem
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    [
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
    ],
  ],
  createProblem
);

// @route   PUT api/problems/:id
// @desc    Update problem
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  [
    [
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
    ],
  ],
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
    [
      check("code", "Code is required").not().isEmpty(),
      check("language", "Language is required").not().isEmpty(),
    ],
  ],
  submitSolution
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

module.exports = router;
