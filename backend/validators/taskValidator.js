import { body, param } from 'express-validator';

export const createTaskValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate')
        .optional()
        .isISO8601().withMessage('Invalid date format')
];

export const updateTaskValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('dueDate')
        .optional()
        .isISO8601().withMessage('Invalid date format')
];

export const taskIdValidation = [
    param('id')
        .isMongoId().withMessage('Invalid task ID')
];
