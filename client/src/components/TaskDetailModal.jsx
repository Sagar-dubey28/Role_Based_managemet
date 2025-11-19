import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { taskAPI } from '../lib/api';

export default function TaskDetailModal({ task, onClose }) {
  const [status, setStatus] = useState(task.status || 'pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await taskAPI.updateTaskStatus(task._id, newStatus);
      setStatus(newStatus);
      setSuccess('Task status updated successfully!');

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (stat) => {
    switch (stat) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'pending':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Task Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <p className="text-lg font-bold text-gray-900">{task.title}</p>
          </div>

          {/* Task Description */}
          {task.description && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['pending', 'in-progress', 'completed'].map((stat) => (
                  <button
                    key={stat}
                    onClick={() => handleStatusChange(stat)}
                    disabled={loading}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-2 transition ${
                      status === stat
                        ? getStatusColor(stat)
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {stat.charAt(0).toUpperCase() + stat.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            {task.priority && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                <p className="text-gray-900">{formatDate(task.dueDate)}</p>
              </div>
            )}

            {/* Created Date */}
            {task.createdAt && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Created</label>
                <p className="text-gray-600 text-sm">{formatDate(task.createdAt)}</p>
              </div>
            )}

            {/* Assigned To */}
            {task.assignedTo && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned To</label>
                <p className="text-gray-900">
                  {task.assignedTo.name || task.assignedTo}
                </p>
              </div>
            )}

            {/* Assigned By */}
            {task.assignedBy && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned By</label>
                <p className="text-gray-900">
                  {task.assignedBy.name || task.assignedBy}
                </p>
              </div>
            )}
          </div>

          {/* Task ID */}
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">Task ID: {task._id}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
