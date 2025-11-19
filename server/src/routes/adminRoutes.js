import express from 'express';
import {
  getAllUsers,
  getAllManagers,
  getAllTasks,
  createUser,
  createManager,
  createTask,
  assignTask,
  deleteUser,
  deleteTask,
  updateTask
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes - admin only
router.use(protect, authorize('admin'));

// Get data
router.get('/users', getAllUsers);
router.get('/managers', getAllManagers);
router.get('/tasks', getAllTasks);

// Create operations
router.post('/create-user', createUser);
router.post('/create-manager', createManager);
router.post('/create-task', createTask);
router.post('/assign-task', assignTask);

// Update operations
router.put('/tasks/:taskId', updateTask);

// Delete operations
router.delete('/users/:userId', deleteUser);
router.delete('/tasks/:taskId', deleteTask);

export default router;
