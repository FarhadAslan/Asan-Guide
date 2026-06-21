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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // base64 data URL-dən yalnız base64 hissəsini al
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/jpeg';

      api.post('/ai/check-document', {
        imageBase64: base64,
        mimeType,
        documentName,
        serviceSlug,
        validationRules,
      }, { timeout: 60000 })
        .then(resolve)
        .catch(reject);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default api;
