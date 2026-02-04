import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    signup,
    login,
    getMe,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import {
    signupValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation
} from '../validators/authValidator.js';

const router = express.Router();

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Protected routes
router.put('/password', protect, changePasswordValidation, changePassword);

export default router;
