import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE_API, // Porta em que a taskflow-api está rodando
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getitem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if(error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;