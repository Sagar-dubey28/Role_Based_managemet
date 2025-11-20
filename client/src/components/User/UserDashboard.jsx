import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { taskAPI } from '../../lib/api';
import { AlertCircle, Clock, CheckCircle, RefreshCw, Calendar as CalendarIcon, LogOut } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('list');
  const [updatingId, setUpdatingId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState({});

  useEffect(() => {
    fetchAssignedTasks();
    // Auto-refresh every 10 seconds (reduced from 5)
    const interval = setInterval(() => {
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

  const fetchAssignedTasks = async () => {
    try {
      const response = await taskAPI.getAssignedTasks();
      setTasks(response.data.tasks || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      setPendingStatus(prev => ({ ...prev, [taskId]: newStatus }));
      const response = await taskAPI.updateTaskStatus(taskId, newStatus);
      
      setTasks(tasks.map(t => t._id === taskId ? response.data.task : t));
      
      setPendingStatus(prev => {
        const newState = { ...prev };
        delete newState[taskId];
        return newState;
      });
      
      setSuccess('Task status updated successfully!');
    } catch (err) {
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

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'todo').length,
  };

  const tasksForDate = tasks.filter(
    t => t.dueDate && new Date(t.dueDate).toDateString() === selectedDate.toDateString()
  );

  const tileContent = ({ date }) => {
    const hasTask = tasks.some(
      t => t.dueDate && new Date(t.dueDate).toDateString() === date.toDateString()
    );
    return hasTask ? <div className="w-2 h-2 bg-indigo-600 rounded-full mx-auto"></div> : null;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'todo': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
            <p className="text-gray-600">Track and update your assigned tasks</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('/user/calendar')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CalendarIcon size={20} />
              Calendar
            </motion.button>
            <motion.button
              onClick={fetchAssignedTasks}
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
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✓ {success}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Calendar</h3>
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              tileContent={tileContent}
              className="w-full"
            />
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">
                Selected: {selectedDate.toLocaleDateString()}
              </p>
              <p>{tasksForDate.length} task(s) on this date</p>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {viewMode === 'list' ? 'All Tasks' : 'Task Kanban'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      viewMode === 'list'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      viewMode === 'kanban'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Kanban
                  </button>
                </div>
              </div>

              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                          <tr key={task._id} className="border-b hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-semibold text-gray-800">{task.title}</td>
                            <td className="px-4 py-3 text-gray-600 text-sm max-w-xs truncate">{task.description}</td>
                            <td className="px-4 py-3">
                              <select
                                value={pendingStatus[task._id] || task.status}
                                onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                                disabled={updatingId === task._id}
                                className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer border-none ${getStatusBadgeClass(pendingStatus[task._id] || task.status)}`}
                              >
                                <option value="todo">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Completed</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-sm">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                            No tasks assigned yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-900 mb-3">
                      Pending ({tasks.filter(t => t.status === 'todo').length})
                    </h4>
                    <div className="space-y-2">
                      {tasks
                        .filter(t => t.status === 'todo')
                        .map(task => (
                          <div key={task._id} className="bg-white p-3 rounded-lg shadow">
                            <p className="font-semibold text-sm">{task.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                            <button
                              onClick={() => handleUpdateStatus(task._id, 'in-progress')}
                              className="mt-2 w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            >
                              Start
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 mb-3">
                      In Progress ({tasks.filter(t => t.status === 'in-progress').length})
                    </h4>
                    <div className="space-y-2">
                      {tasks
                        .filter(t => t.status === 'in-progress')
                        .map(task => (
                          <div key={task._id} className="bg-white p-3 rounded-lg shadow">
                            <p className="font-semibold text-sm">{task.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                            <button
                              onClick={() => handleUpdateStatus(task._id, 'done')}
                              className="mt-2 w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                            >
                              Complete
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-900 mb-3">
                      Completed ({tasks.filter(t => t.status === 'done').length})
                    </h4>
                    <div className="space-y-2">
                      {tasks
                        .filter(t => t.status === 'done')
                        .map(task => (
                          <div key={task._id} className="bg-white p-3 rounded-lg shadow opacity-75">
                            <p className="font-semibold text-sm line-through">{task.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
