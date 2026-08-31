import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem(
      'bachao_token'
    );

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    return Promise.reject(
      new Error(message)
    );
  }
);

export const authApi = {
  register: (data) =>
    api.post(
      '/auth/register',
      data
    ),

  login: (data) =>
    api.post(
      '/auth/login',
      data
    ),

  me: () =>
    api.get('/auth/me'),

  updateProfile: (data) =>
    api.put(
      '/auth/me',
      data
    ),
};

export const requestApi = {
  list: (params) =>
    api.get(
      '/requests',
      { params }
    ),

  mine: () =>
    api.get(
      '/requests/mine'
    ),

  get: (id) =>
    api.get(
      `/requests/${id}`
    ),

  create: (data) =>
    api.post(
      '/requests',
      data
    ),

  sos: (data) =>
    api.post(
      '/requests/sos',
      data
    ),
};

export const volunteerApi = {
  claim: (id) =>
    api.put(
      `/volunteer/requests/${id}/claim`
    ),

  setStatus: (
    id,
    status
  ) =>
    api.put(
      `/volunteer/requests/${id}/status`,
      { status }
    ),

  tasks: () =>
    api.get(
      '/volunteer/tasks'
    ),

  logDistribution: (data) =>
    api.post(
      '/volunteer/distributions',
      data
    ),

  distributions: (params) =>
    api.get(
      '/volunteer/distributions',
      { params }
    ),
};

export const ratingApi = {
  confirmAndRate: (data) =>
    api.post(
      '/ratings',
      data
    ),

  forUser: (id) =>
    api.get(
      `/ratings/user/${id}`
    ),
};

export default api;