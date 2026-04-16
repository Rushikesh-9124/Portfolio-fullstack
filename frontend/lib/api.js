import axios from 'axios';

const API_URL = process.env. || 'https://portfolio-fullstack-4afv.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('portfolio_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_user');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// About
export const aboutAPI = {
  get: () => api.get('/about'),
  update: (data) => api.put('/about', data),
};

// Skills
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

// // Projects
// export const projectsAPI = {
//   getAll: (params) => api.get('/projects', { params }),
//   create: (data) => api.post('/projects', data),
//   update: (id, data) => api.put(`/projects/${id}`, data),
//   delete: (id) => api.delete(`/projects/${id}`),
// };

export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),

  create: (data) =>
    api.post('/projects', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, data) =>
    api.put(`/projects/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id) => api.delete(`/projects/${id}`),
};

// Certificates
export const certificatesAPI = {
  getAll: () => api.get('/certificates'),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
};

// Contact
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};
