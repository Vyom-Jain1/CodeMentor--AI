const { body, validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validators
const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validate,
];

const loginValidator = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").exists().withMessage("Password is required"),
  validate,
];

// Problem validators
const problemValidator = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),
  body("difficulty")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be easy, medium, or hard"),
  body("category")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Category must be at least 3 characters long"),
  body("testCases").isArray().withMessage("Test cases must be an array"),
  body("testCases.*.input").exists().withMessage("Test case input is required"),
  body("testCases.*.output")
    .exists()
    .withMessage("Test case output is required"),
  validate,
];

// Solution submission validator
const solutionValidator = [
  body("code").trim().isLength({ min: 1 }).withMessage("Code cannot be empty"),
  body("language")
    .isIn(["javascript", "python", "java", "cpp"])
    .withMessage("Invalid programming language"),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  problemValidator,
  solutionValidator,
};
