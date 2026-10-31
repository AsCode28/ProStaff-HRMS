import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const errMsg = (e) =>
  e.response?.data?.message || e.response?.data?.errors?.[0]?.msg || 'Something went wrong';

export default api;
