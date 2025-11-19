import User from '../models/User.js';
import Task from '../models/Task.js';

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

// Get all managers
export const getAllManagers = async (req, res, next) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('_id name email');
    res.json({
      success: true,
      managers
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// Create user (admin only)
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create manager (admin only)
export const createManager = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if manager already exists
    const existingManager = await User.findOne({ email });
    if (existingManager) {
      return res.status(409).json({
        success: false,
        message: 'Manager with this email already exists'
      });
    }

    // Create manager
    const manager = await User.create({
      name,
      email,
      password,
      role: 'manager'
    });

    res.status(201).json({
      success: true,
      message: 'Manager created successfully',
      manager: {
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create task (admin only)
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;
    const adminId = req.user.id;

    if (!title || !description || !priority || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, priority, dueDate, assignedTo'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      priority,
      status: status || 'todo',
      dueDate,
      assignedTo,
      createdBy: adminId
    });

    // Populate references with full user object
    await task.populate('assignedTo', 'name email role _id');
    await task.populate('createdBy', 'name email role _id');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// Assign task to manager
export const assignTask = async (req, res, next) => {
  try {
    const { taskId, managerId } = req.body;

    if (!taskId || !managerId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide taskId and managerId'
      });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: managerId },
      { new: true }
    ).populate('assignedTo', 'name email').populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task assigned successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete task (admin only)
export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { title, description, priority, status, dueDate, assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email').populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};
