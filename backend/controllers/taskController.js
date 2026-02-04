import { validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { successResponse, errorResponse, asyncHandler } from '../utils/apiResponse.js';

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        user: req.user.id
    });

    return successResponse(res, 201, { task }, 'Task created successfully');
});

// @desc    Get all tasks for logged-in user
// @route   GET /api/v1/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
    const { status, priority, search, sort = '-createdAt' } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Filter by status
    if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
        query.status = status;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
        query.priority = priority;
    }

    // Search by title or description
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const tasks = await Task.find(query).sort(sort);

    return successResponse(res, 200, { 
        count: tasks.length, 
        tasks 
    }, 'Tasks retrieved successfully');
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTask = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
        return errorResponse(res, 404, 'Task not found');
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
        return errorResponse(res, 403, 'Not authorized to access this task');
    }

    return successResponse(res, 200, { task }, 'Task retrieved successfully');
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
        return errorResponse(res, 404, 'Task not found');
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
        return errorResponse(res, 403, 'Not authorized to update this task');
    }

    const { title, description, status, priority, dueDate } = req.body;

    // Update only provided fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return successResponse(res, 200, { task }, 'Task updated successfully');
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, 400, errors.array()[0].msg);
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
        return errorResponse(res, 404, 'Task not found');
    }

    // Check ownership
    if (task.user.toString() !== req.user.id) {
        return errorResponse(res, 403, 'Not authorized to delete this task');
    }

    await task.deleteOne();

    return successResponse(res, 200, {}, 'Task deleted successfully');
});
