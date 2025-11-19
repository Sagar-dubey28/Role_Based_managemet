import express from 'express';
import {
  getAllTasks,
  getAssignedTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All authenticated users can view tasks (filtered by role)
router.get('/', protect, getAllTasks);
router.get('/assigned', protect, getAssignedTasks);
router.get('/stats', protect, getTaskStats);

// Create task - admin and manager only
router.post('/', protect, authorize('admin', 'manager'), createTask);

// Update task - admin, manager, or assigned user
router.put('/:id', protect, updateTask);
router.patch('/:id/status', protect, updateTaskStatus);

// Delete task - admin or creator only
router.delete('/:id', protect, deleteTask);

export default router;
