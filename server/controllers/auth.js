const User = require("../models/User");
const jwt = require("jsonwebtoken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      error: "Error creating user account",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: "Error logging in",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('progress.completedProblems');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      error: "Error fetching user data",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update basic info
    if (name) user.name = name.trim();
    if (email) {
      // Check if email is already taken by another user
      const emailExists = await User.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: user._id }
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: "Email already in use",
        });
      }
      user.email = email.toLowerCase().trim();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          error: "Current password is required to set new password",
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: "New password must be at least 6 characters",
        });
      }

      user.password = newPassword;
    }

    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({
      success: false,
      error: "Error updating profile",
    });
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
};