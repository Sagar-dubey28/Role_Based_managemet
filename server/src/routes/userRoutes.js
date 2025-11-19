import express from 'express';
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getProfile,
  getTeamMembers
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current user profile
router.get('/profile/me', protect, getProfile);

// Managers can get their team members
router.get('/team', protect, authorize('manager'), getTeamMembers);

// Admin only - User management
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
