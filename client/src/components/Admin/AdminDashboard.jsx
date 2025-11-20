import { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle, LogOut, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminAPI } from '../../lib/api';
import AddUserModal from './AddUserModal';
import AddManagerModal from './AddManagerModal';
import AddTaskModal from './AddTaskModal';

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // State management
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('users');

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersRes, managersRes, tasksRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllManagers(),
        adminAPI.getAllTasks()
      ]);

      setUsers(usersRes.data.users || []);
      setManagers(managersRes.data.managers || []);
      setTasks(tasksRes.data.tasks || []);
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle add user
  const handleAddUser = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await adminAPI.createUser(formData);
      
      setUsers(prev => [...prev, response.data.user]);
      setSuccess('User created successfully!');
      setShowAddUserModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add manager
  const handleAddManager = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await adminAPI.createManager(formData);
      
      setManagers(prev => [...prev, response.data.manager]);
      setSuccess('Manager created successfully!');
      setShowAddManagerModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create manager');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add task
  const handleAddTask = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await adminAPI.createTask(formData);
      
      setTasks(prev => [...prev, response.data.task]);
      setSuccess('Task created successfully!');
      setShowAddTaskModal(false);
      
      // Refetch tasks to ensure sync
      fetchAllData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setError('');
      await adminAPI.deleteUser(userId);
      
      setUsers(prev => prev.filter(u => u._id !== userId));
      setManagers(prev => prev.filter(m => m._id !== userId));
      setSuccess('User deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setError('');
      await adminAPI.deleteTask(taskId);
      
      setTasks(prev => prev.filter(t => t._id !== taskId));
      setSuccess('Task deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, managers, and tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/admin/calendar')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition border border-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CalendarIcon size={20} />
              <span className="font-medium">Calendar</span>
            </motion.button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 shrink-0"></div>
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <motion.div 
          className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex border-b">
            <motion.button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-medium text-center transition ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ backgroundColor: activeTab === 'users' ? undefined : '#f9fafb' }}
              whileTap={{ scale: 0.98 }}
            >
              Users ({users.length})
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('managers')}
              className={`flex-1 px-6 py-4 font-medium text-center transition ${
                activeTab === 'managers'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ backgroundColor: activeTab === 'managers' ? undefined : '#f9fafb' }}
              whileTap={{ scale: 0.98 }}
            >
              Managers ({managers.length})
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 px-6 py-4 font-medium text-center transition ${
                activeTab === 'tasks'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ backgroundColor: activeTab === 'tasks' ? undefined : '#f9fafb' }}
              whileTap={{ scale: 0.98 }}
            >
              Tasks ({tasks.length})
            </motion.button>
          </div>

          {/* Tab Content */}
          <motion.div 
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Users Tab */}
            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button
                  onClick={() => setShowAddUserModal(true)}
                  className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} /> Add User
                </motion.button>

                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                            <td className="px-4 py-3 text-gray-600">{user.email}</td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="inline-flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* Managers Tab */}
            {activeTab === 'managers' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button
                  onClick={() => setShowAddManagerModal(true)}
                  className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(34, 197, 94, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} /> Add Manager
                </motion.button>

                {managers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No managers found</p>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {managers.map(manager => (
                      <motion.div
                        key={manager._id}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition"
                        variants={itemVariants}
                        whileHover={{ y: -3 }}
                      >
                        <h3 className="font-semibold text-gray-800 mb-2">{manager.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{manager.email}</p>
                        <button
                          onClick={() => handleDeleteUser(manager._id)}
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded transition border border-red-200"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button
                  onClick={() => setShowAddTaskModal(true)}
                  className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(147, 51, 234, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} /> Create Task
                </motion.button>

                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tasks found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Assigned To</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map(task => (
                          <tr key={task._id} className="border-b hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-800">{task.title}</td>
                            <td className="px-4 py-3 text-gray-600">
                              {task.assignedTo?.name || 'Unassigned'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {formatDate(task.dueDate)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="inline-flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Managers</h3>
            <p className="text-3xl font-bold text-green-600">{managers.length}</p>
          </motion.div>
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-purple-600">{tasks.length}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
        isLoading={isSubmitting}
      />

      <AddManagerModal
        isOpen={showAddManagerModal}
        onClose={() => setShowAddManagerModal(false)}
        onSubmit={handleAddManager}
        isLoading={isSubmitting}
      />

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSubmit={handleAddTask}
        isLoading={isSubmitting}
        managers={managers}
        users={users}
      />
    </div>
  );
}
