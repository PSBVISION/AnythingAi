import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';

// Protect routes - verify token
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return errorResponse(res, 401, 'Not authorized, no token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return errorResponse(res, 401, 'User not found');
        }
        
        next();
    } catch (error) {
        return errorResponse(res, 401, 'Not authorized, token invalid');
    }
};

// Admin only middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        errorResponse(res, 403, 'Access denied. Admin only.');
    }
};
