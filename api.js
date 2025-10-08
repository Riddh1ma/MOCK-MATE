import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (profileData) => api.put('/user/profile', profileData),
  uploadImage: (formData) => api.post('/user/profile/upload-image', formData),
  getLeaderboard: (limit = 10) => api.get(`/user/leaderboard?limit=${limit}`),
  getUserStats: () => api.get('/user/stats'),
  getMentors: () => api.get('/user/mentors'),
};

// Interview API
export const interviewAPI = {
  create: (interviewData) => api.post('/interviews', interviewData),
  getMyInterviews: (status) => api.get(`/interviews${status ? `?status=${status}` : ''}`),
  getInterview: (id) => api.get(`/interviews/${id}`),
  startInterview: (id) => api.put(`/interviews/${id}/start`),
  completeInterview: (id, feedback) => api.put(`/interviews/${id}/complete`, { feedback }),
  cancelInterview: (id) => api.delete(`/interviews/${id}`),
  getAvailablePeerInterviews: () => api.get('/interviews/available'),
  joinPeerInterview: (id) => api.post(`/interviews/${id}/join`),
};

// Question API
export const questionAPI = {
  getQuestions: (params = {}) => api.get('/questions', { params }),
  getQuestion: (id) => api.get(`/questions/${id}`),
  getRandomQuestions: (params = {}) => api.get('/questions/random', { params }),
  getCodingQuestions: (params = {}) => api.get('/questions/coding', { params }),
  getMCQQuestions: (params = {}) => api.get('/questions/mcq', { params }),
  getBehavioralQuestions: (params = {}) => api.get('/questions/behavioral', { params }),
};

// Coding API
export const codingAPI = {
  submitCode: (submissionData) => api.post('/coding/submit', submissionData),
  getSubmissions: (params = {}) => api.get('/coding/submissions', { params }),
  getSubmission: (id) => api.get(`/coding/submissions/${id}`),
  testCode: (testData) => api.post('/coding/test', testData),
};

// Behavioral API
export const behavioralAPI = {
  submitResponse: (responseData) => api.post('/behavioral/submit', responseData),
  getResponses: (params = {}) => api.get('/behavioral/responses', { params }),
  getResponse: (id) => api.get(`/behavioral/responses/${id}`),
  analyzeResponse: (responseId) => api.post(`/behavioral/responses/${responseId}/analyze`),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getSystemStats: () => api.get('/admin/stats'),
};

export default api;
