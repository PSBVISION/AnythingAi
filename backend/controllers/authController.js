import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/apiResponse.js';

// @desc    Signup a new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return errorResponse(res, 400, 'User already exists with this email');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password
    });

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 201, {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return errorResponse(res, 401, 'Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return errorResponse(res, 401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    return successResponse(res, 200, {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }, 'Login successful');
});

// @desc    Get current user profile
// @route   GET /api/v1/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    
    return successResponse(res, 200, {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    }, 'Profile retrieved successfully');
});

// @desc    Update user profile
// @route   PUT /api/v1/me
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (existingUser) {
            return errorResponse(res, 400, 'Email already in use');
        }
        user.email = email;
    }

    await user.save();

    return successResponse(res, 200, {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }, 'Profile updated successfully');
});

// @desc    Change password
// @route   PUT /api/v1/auth/password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return errorResponse(res, 401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, {}, 'Password updated successfully');
});
