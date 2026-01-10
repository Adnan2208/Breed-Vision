/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError, sendSuccess } = require('../utils/apiResponse');
const { generateToken } = require('../middleware/auth.middleware');

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, role, department, state, district } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(400, 'User with this email or username already exists');
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role: role || 'user',
    department,
    state,
    district,
  });

  // Generate token
  const token = generateToken(user._id);

  sendSuccess(res, 201, {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      state: user.state,
      district: user.district,
    },
    token,
  }, 'User registered successfully');
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Account is deactivated. Please contact admin.');
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = generateToken(user._id);

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendSuccess(res, 200, {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      state: user.state,
      district: user.district,
      lastLogin: user.lastLogin,
    },
    token,
  }, 'Login successful');
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  sendSuccess(res, 200, null, 'Logged out successfully');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  sendSuccess(res, 200, {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      state: user.state,
      district: user.district,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    },
  }, 'Profile retrieved successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/auth/me
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { username, department, state, district } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { username, department, state, district },
    { new: true, runValidators: true }
  );

  sendSuccess(res, 200, {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      department: user.department,
      state: user.state,
      district: user.district,
    },
  }, 'Profile updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  sendSuccess(res, 200, null, 'Password changed successfully');
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
};
