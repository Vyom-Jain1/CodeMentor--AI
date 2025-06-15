const User = require("../models/User");
<<<<<<< HEAD
const { validationResult } = require("express-validator");
=======
const jwt = require("jsonwebtoken");
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log("Registration request body:", req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;
    console.log("Registration attempt for:", { name, email });

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
      console.log("User already exists:", email);
      return res.status(400).json({
        success: false,
<<<<<<< HEAD
        error: "Email already registered",
=======
        error: "User already exists with this email",
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });
    console.log("User created successfully:", user._id);

<<<<<<< HEAD
    // Send token response
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
=======
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      error: "Error creating user account",
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
    });
  } catch (err) {
    console.error("Registration error:", err);
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    console.log("Login attempt:", req.body.email);

    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    console.log("Login successful for user:", email);
    sendTokenResponse(user, 200, res);
  } catch (err) {
<<<<<<< HEAD
    console.error("Login error:", err);
    next(err);
=======
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: "Error logging in",
    });
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  // Added 'next' parameter
  try {
<<<<<<< HEAD
    const user = await User.findById(req.user.id);

=======
    const user = await User.findById(req.user.id).populate('progress.completedProblems');
    
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
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
<<<<<<< HEAD
    next(err); // Use error handler middleware instead of direct response
=======
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
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
<<<<<<< HEAD
  try {
    // Clear any auth cookies if they exist
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
=======
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Remove password from output
  user.password = undefined;

<<<<<<< HEAD
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
};
=======
  res.status(statusCode).json({
    success: true,
    token,
    data: user,
  });
};
>>>>>>> 7f8f4cf10e81592f512281552bd44bd45ba50813
