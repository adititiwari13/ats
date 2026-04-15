import axios from 'axios';

const API_URL = 'https://9g1bun-ip-103-161-223-15.tunnelmole.net/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Job APIs
export const jobAPI = {
  getAll: () => api.get('/jobs'),
  getAllAdmin: () => api.get('/jobs/all'),
  getById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  toggle: (id) => api.patch(`/jobs/${id}/toggle`),
  delete: (id) => api.delete(`/jobs/${id}`),
  search: (keyword) => api.get(`/jobs/search?keyword=${keyword}`),
  filter: (params) => api.get('/jobs/filter', { params }),
};

// Application APIs
export const applicationAPI = {
  apply: (jobId, data) => api.post(`/applications/apply/${jobId}`, data),
  getMyApplications: () => api.get('/applications/my-applications'),
  getAll: () => api.get('/applications'),
  getByJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};

// Resume APIs
export const resumeAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMyResume: () => api.get('/resumes/my-resume'),
  download: (candidateId) => api.get(`/resumes/download/${candidateId}`, { responseType: 'blob' })
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
