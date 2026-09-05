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

export const campaignApi = {
  list: (params) =>
    api.get(
      '/campaigns',
      { params }
    ),

  get: (id) =>
    api.get(
      `/campaigns/${id}`
    ),

  create: (data) =>
    api.post(
      '/campaigns',
      data
    ),

  donate: (
    id,
    data
  ) =>
    api.post(
      `/campaigns/${id}/donate`,
      data
    ),

  donations: (id) =>
    api.get(
      `/campaigns/${id}/donations`
    ),

  distribute: (
    id,
    amount
  ) =>
    api.put(
      `/campaigns/${id}/distribute`,
      { amount }
    ),

  matches: (id) =>
    api.get(
      `/campaigns/${id}/matches`
    ),
};

export const shelterApi = {
  list: (params) =>
    api.get(
      '/shelters',
      { params }
    ),

  create: (data) =>
    api.post(
      '/shelters',
      data
    ),

  setOccupancy: (
    id,
    currentOccupancy
  ) =>
    api.put(
      `/shelters/${id}/occupancy`,
      { currentOccupancy }
    ),
};

export const missingApi = {
  list: (params) =>
    api.get(
      '/missing',
      { params }
    ),

  create: (data) =>
    api.post(
      '/missing',
      data
    ),

  markFound: (id) =>
    api.put(
      `/missing/${id}/found`
    ),
};

export const orgApi = {
  list: (params) =>
    api.get(
      '/orgs',
      { params }
    ),

  get: (id) =>
    api.get(
      `/orgs/${id}`
    ),

  create: (data) =>
    api.post(
      '/orgs',
      data
    ),

  inventory: (id) =>
    api.get(
      `/orgs/${id}/inventory`
    ),

  addItem: (id, data) =>
    api.post(
      `/orgs/${id}/inventory`,
      data
    ),

  updateItem: (
    itemId,
    data
  ) =>
    api.put(
      `/orgs/inventory/${itemId}`,
      data
    ),
};

export const dashboardApi = {
  heatmap: () =>
    api.get(
      '/dashboard/heatmap'
    ),
};

export default api;