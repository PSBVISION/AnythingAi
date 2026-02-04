// Custom error class for API errors
export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
    }
}

// Success response helper
export const successResponse = (res, statusCode, data, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        ...data
    });
};

// Error response helper
export const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message
    });
};

// Async handler to wrap async functions and catch errors
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
