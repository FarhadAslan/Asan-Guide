import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Xidmətlər
export const getServices = () => api.get('/services');
export const getService  = (slug) => api.get(`/services/${slug}`);

// AI
export const chatWithAI = (message, serviceSlug) =>
  api.post('/ai/chat', { message, serviceSlug });

export const checkDocument = (file, documentName, serviceSlug, validationRules) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('documentName', documentName);
  if (serviceSlug)      formData.append('serviceSlug', serviceSlug);
  if (validationRules)  formData.append('validationRules', validationRules);
  return api.post('/ai/check-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
};

export default api;
