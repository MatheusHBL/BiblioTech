import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5120',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Requisição não autorizada (401)! Redirecionando para login...');
      // Redirecionar para a página de login
      // Ex: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;