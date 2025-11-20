import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { taskAPI } from '../../lib/api';
import { AlertCircle, Clock, CheckCircle, RefreshCw, Trash2, Plus, Calendar as CalendarIcon, LogOut } from 'lucide-react';
import AddTaskModal from './AddTaskModal';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState({});
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Only fetch on initial mount
    fetchTasks();
    fetchUsers();
    
    // Auto-refresh only every 10 seconds (not 5)
    const interval = setInterval(() => {
      // Don't show loading state on auto-refresh
      const refreshTasks = async () => {
        try {
          const response = await taskAPI.getAssignedTasks();
          setTasks(response.data.tasks || []);
        } catch (err) {
          console.error('Auto-refresh failed:', err);
        }
      };
      refreshTasks();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskAPI.getAssignedTasks();
      setTasks(response.data.tasks || []);
    } catch (err) {
      setError('Failed to fetch tasks: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4500/api/users/team', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    }
  };

  const handleAddTask = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      const response = await taskAPI.createTask(formData);
      
      setTasks(prevTasks => [response.data.task, ...prevTasks]);
      setSuccess('Task assigned successfully!');
      setShowAddTaskModal(false);
    } catch (err) {
      setError('Failed to create task: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      setPendingStatus(prev => ({ ...prev, [taskId]: newStatus }));
      setError('');

      const response = await taskAPI.updateTaskStatus(taskId, newStatus);

      // Update tasks with response data
      setTasks(prevTasks =>
        prevTasks.map(t => (t._id === taskId ? response.data.task : t))
      );

      setPendingStatus(prev => {
        const newState = { ...prev };
        delete newState[taskId];
        return newState;
      });

      setSuccess('Task status updated successfully!');
    } catch (err) {
      // Revert optimistic update on error
      setPendingStatus(prev => {
        const newState = { ...prev };
        delete newState[taskId];
        return newState;
      });
      setError('Failed to update task: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setError('');
      await taskAPI.deleteTask(taskId);

      setTasks(prevTasks => prevTasks.filter(t => t._id !== taskId));
      setSuccess('Task deleted successfully!');
    } catch (err) {
      setError('Failed to delete task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'done').length,
  };

  const filteredTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-start mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Manager Dashboard</h1>
            <p className="text-gray-600">Manage and track your assigned tasks</p>
          </div>
          <motion.div className="flex gap-3">
            <motion.button
              onClick={() => navigate('/manager/calendar')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CalendarIcon size={20} />
              Calendar
            </motion.button>
            <motion.button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Assign Task
            </motion.button>
            <motion.button
              onClick={fetchTasks}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={20} />
              Refresh
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1 shrink-0"></div>
            <span>{success}</span>
          </div>
        )}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <CheckCircle className="text-blue-500" size={32} />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="text-yellow-500" size={32} />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="text-blue-600" size={32} />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </motion.div>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-4 flex-wrap">
          {[
            { value: 'all', label: 'All Tasks' },
            { value: 'todo', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'done', label: 'Completed' },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === tab.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6 border-l-4 border-indigo-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{task.title}</h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Priority:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                    </span>
                  </div>

                  {task.assignedTo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Assigned To:</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{task.assignedTo.name}</p>
                        <p className="text-xs text-gray-500">{task.assignedTo.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="text-sm text-gray-800">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label className="text-sm text-gray-600 block mb-2">Update Status:</label>
                  <select
                    value={pendingStatus[task._id] || task.status}
                    onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                    disabled={updatingId === task._id}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      updatingId === task._id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  {updatingId === task._id && (
                    <p className="text-xs text-gray-500 mt-1">Updating...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No tasks found</p>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSubmit={handleAddTask}
        isLoading={isSubmitting}
        users={users}
      />
    </motion.div>
  );
}
