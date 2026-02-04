import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import {
    createTaskValidation,
    updateTaskValidation,
    taskIdValidation
} from '../validators/taskValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
    .get(getTasks)
    .post(createTaskValidation, createTask);

router.route('/:id')
    .get(taskIdValidation, getTask)
    .put([...taskIdValidation, ...updateTaskValidation], updateTask)
    .delete(taskIdValidation, deleteTask);

export default router;
