import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bachao_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
};

export const requestApi = {
  list: (params) => api.get('/requests', { params }),
  mine: () => api.get('/requests/mine'),
  get: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  sos: (data) => api.post('/requests/sos', data),
};

export default api;
