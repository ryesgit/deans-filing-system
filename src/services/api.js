import axios from 'axios';

// Get base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      // Handle unauthorized errors
      if (status === 401 && window.location.pathname !== '/login') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Return error with message
      return Promise.reject({
        status,
        message: data?.message || data?.error || 'An error occurred',
        data: data,
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
};

// Dashboard Stats API
export const statsAPI = {
  getDashboard: () => api.get('/api/stats/dashboard'),
  getActivityLog: () => api.get('/api/stats/activity-log'),
};

// Files API
export const filesAPI = {
  getAll: () => api.get('/api/files/all'),
  search: (query) => api.get('/api/files/search', { params: { q: query } }),
  download: (id) => api.get(`/api/files/download/${id}`, { responseType: 'blob' }),
  upload: (formData) => api.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, data) => api.patch(`/api/files/${id}`, data),
  delete: (id) => api.delete(`/api/files/${id}`),
};

// Categories API (used as "folders" in UI)
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// Requests API
export const requestsAPI = {
  getAll: () => api.get('/api/requests'),
  create: (data) => api.post('/api/requests', data),
  update: (id, data) => api.put(`/api/requests/${id}`, data),
  approve: (id, notes) => api.put(`/api/requests/${id}/approve`, { notes }),
  decline: (id, reason) => api.put(`/api/requests/${id}/decline`, { reason }),
  delete: (id) => api.delete(`/api/requests/${id}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/users'),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  delete: (id) => api.delete(`/api/users/${id}`),
  approve: (id) => api.post(`/api/users/${id}/approve`),
  reject: (id, reason) => api.post(`/api/users/${id}/reject`, { reason }),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/api/notifications'),
  create: (data) => api.post('/api/notifications', data),
  markAsRead: (id) => api.put(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
  delete: (id) => api.delete(`/api/notifications/${id}`),
};

// Reports API
export const reportsAPI = {
  getUserActivity: (userId, days) => api.get(`/api/reports/user-activity/${userId}`, { params: { days } }),
  generate: (params) => api.get('/api/reports/generate', { params }),
  getFileActivity: (days) => api.get('/api/reports/file-activity', { params: { days } }),
};

export default api;
