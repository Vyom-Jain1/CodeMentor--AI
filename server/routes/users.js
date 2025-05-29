const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
