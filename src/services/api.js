import axios from 'axios';

// Criando uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptador de requisições
api.interceptors.request.use(
  config => {
    // Obter token do localStorage
    const token = localStorage.getItem('token');
    
    // Se tiver token, adiciona no header de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptador de respostas
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Tratamento de erros globais
    const { response } = error;
    
    // Erro 401 (não autorizado) - token expirado ou inválido
    if (response && response.status === 401) {
      // Limpar token e redirecionar para login
      localStorage.removeItem('token');
      
      // Se a aplicação tiver router disponível globalmente
      // router.push('/login');
      
      // Ou usar redirecionamento do navegador
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;