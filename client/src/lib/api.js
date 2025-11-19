import axiosInstance from './axiosInstance';

// Auth API
export const authAPI = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
};

// Task API
export const taskAPI = {
  getAllTasks: (params) => axiosInstance.get('/tasks', { params }),
  getAssignedTasks: () => axiosInstance.get('/tasks/assigned'),
  createTask: (data) => axiosInstance.post('/tasks', data),
  updateTask: (id, data) => axiosInstance.put(`/tasks/${id}`, data),
  updateTaskStatus: (id, status) => axiosInstance.patch(`/tasks/${id}/status`, { status }),
  deleteTask: (id) => axiosInstance.delete(`/tasks/${id}`),
  getTaskStats: () => axiosInstance.get('/tasks/stats'),
};

// User API
export const userAPI = {
  getAllUsers: (params) => axiosInstance.get('/users', { params }),
  getUser: (id) => axiosInstance.get(`/users/${id}`),
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
  getProfile: () => axiosInstance.get('/users/profile/me'),
};

// Admin API
export const adminAPI = {
  // Get data
  getAllUsers: () => axiosInstance.get('/admin/users'),
  getAllManagers: () => axiosInstance.get('/admin/managers'),
  getAllTasks: () => axiosInstance.get('/admin/tasks'),
  
  // Create operations
  createUser: (data) => axiosInstance.post('/admin/create-user', data),
  createManager: (data) => axiosInstance.post('/admin/create-manager', data),
  createTask: (data) => axiosInstance.post('/admin/create-task', data),
  assignTask: (data) => axiosInstance.post('/admin/assign-task', data),
  
  // Update operations
  updateTask: (taskId, data) => axiosInstance.put(`/admin/tasks/${taskId}`, data),
  
  // Delete operations
  deleteUser: (userId) => axiosInstance.delete(`/admin/users/${userId}`),
  deleteTask: (taskId) => axiosInstance.delete(`/admin/tasks/${taskId}`),
};

export default axiosInstance;
