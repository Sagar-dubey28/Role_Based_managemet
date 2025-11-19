import Task from '../models/Task.js';
import User from '../models/User.js';

export const getAllTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, assignedTo, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    // Role-based filtering
    if (req.user.role === 'user') {
      filter.assignedTo = req.user.id;
    } else if (req.user.role === 'manager') {
      // Manager can see tasks assigned to their team
      const managerTeam = await User.find({ role: 'user' });
      const teamIds = managerTeam.map(u => u._id);
      filter.$or = [
        { assignedTo: { $in: teamIds } },
        { createdBy: req.user.id }
      ];
    }
    // Admin can see all tasks (no filter)

    // Additional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedTasks = async (req, res, next) => {
  try {
    let filter = {};

    // Manager - see tasks assigned to them and tasks they created
    if (req.user.role === 'manager') {
      filter.$or = [
        { assignedTo: req.user.id },
        { createdBy: req.user.id }
      ];
    }
    // User - see only tasks assigned to them
    else if (req.user.role === 'user') {
      filter.assignedTo = req.user.id;
    }
    // Admin - see all tasks
    else {
      // no filter
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email role')
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

export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    // Validation
    if (!title || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, assignedTo, and dueDate'
      });
    }

    // Check permissions
    if (req.user.role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'Users cannot create tasks'
      });
    }

    // For managers, ensure they're assigning to their team members
    if (req.user.role === 'manager') {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser || assignedUser.role !== 'user') {
        return res.status(403).json({
          success: false,
          message: 'Managers can only assign tasks to team members'
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id,
      priority: priority || 'medium',
      dueDate
    });

    await task.populate('assignedTo', 'name email role');
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

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user') {
      // Users can only update their own tasks and only status
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own tasks'
        });
      }
      task.status = status || task.status;
    } else {
      // Admin and manager can update all fields
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
    }

    // Set completedAt if status is done
    if (task.status === 'done' && !task.completedAt) {
      task.completedAt = new Date();
    }

    await task.save();
    await task.populate('assignedTo', 'name email role');
    await task.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: todo, in-progress, or done'
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions - only assigned user, manager, or admin can update status
    if (req.user.role === 'user' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update status of your assigned tasks'
      });
    }

    task.status = status;

    // Set completedAt if status is done
    if (task.status === 'done' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (task.status !== 'done') {
      task.completedAt = null;
    }

    await task.save();
    await task.populate('assignedTo', 'name email role');
    await task.populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions - only creator or admin can delete
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own tasks'
      });
    }

    await Task.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'user') {
      filter.assignedTo = req.user.id;
    } else if (req.user.role === 'manager') {
      const managerTeam = await User.find({ role: 'user' });
      const teamIds = managerTeam.map(u => u._id);
      filter.$or = [
        { assignedTo: { $in: teamIds } },
        { createdBy: req.user.id }
      ];
    }

    const stats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0
    };

    stats.forEach(stat => {
      result.total += stat.count;
      if (stat._id === 'todo') result.todo = stat.count;
      if (stat._id === 'in-progress') result.inProgress = stat.count;
      if (stat._id === 'done') result.done = stat.count;
    });

    res.json({
      success: true,
      stats: result
    });
  } catch (error) {
    next(error);
  }
};
