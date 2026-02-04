import express from 'express';
import { protect } from '../middleware/auth.js';
import { getMe, updateProfile } from '../controllers/authController.js';
import { updateProfileValidation } from '../validators/authValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/', getMe);
router.put('/', updateProfileValidation, updateProfile);

export default router;
