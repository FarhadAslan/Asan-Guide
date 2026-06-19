import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Token əlavə et
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xidmətlər
export const getServices = () => api.get('/services');
export const getService = (slug) => api.get(`/services/${slug}`);

// Admin
export const adminLogin = (data) => api.post('/admin/login', data);
export const getAdminServices = () => api.get('/admin/services');
export const createService = (data) => api.post('/admin/services', data);
export const updateService = (id, data) => api.put(`/admin/services/${id}`, data);
export const deleteService = (id) => api.delete(`/admin/services/${id}`);

// AI
export const chatWithAI = (message, serviceSlug) =>
  api.post('/ai/chat', { message, serviceSlug });

export const checkDocument = (file, documentName, serviceSlug, validationRules) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('documentName', documentName);
  if (serviceSlug) formData.append('serviceSlug', serviceSlug);
  if (validationRules) formData.append('validationRules', validationRules);
  return api.post('/ai/check-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
};

export default api;
