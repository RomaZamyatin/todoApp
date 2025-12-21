import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 секунд таймаут
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка ошибок авторизации
    if (error.response?.status === 401) {
      // Если токен истек или невалидный
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Редирект на страницу входа только если мы не на ней
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    
    // Обработка сетевых ошибок
    if (!error.response) {
      console.error('Сетевая ошибка:', error.message);
      return Promise.reject({
        response: {
          data: {
            message: 'Ошибка соединения с сервером. Проверьте интернет-соединение.'
          }
        }
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;