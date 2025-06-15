const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { register, login, getMe, logout } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  register
);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, getMe);

// @route   GET api/auth/logout
// @desc    Log user out
// @access  Private
router.get("/logout", protect, logout);

// @route   GET api/auth/check
// @desc    Check authentication status
// @access  Public
router.get("/check", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth check endpoint is working",
  });
});

module.exports = router;
