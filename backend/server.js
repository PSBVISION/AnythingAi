import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import taskRoutes from './routes/tasks.js';
import { errorResponse } from './utils/apiResponse.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/me', userRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware (must have 4 parameters)
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error(err.stack);
    errorResponse(res, err.statusCode || 500, err.message || 'Something went wrong!');
});

// 404 handler (must be last)
app.use((req, res) => {
    errorResponse(res, 404, 'Route not found');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
