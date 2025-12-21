import api from './api';

// Регистрация нового пользователя
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.status === 'OK') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return {
        success: true,
        message: response.data.message,
        token: response.data.token,
        user: response.data.user
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Ошибка регистрации'
      };
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка соединения с сервером'
    };
  }
};

// Вход пользователя
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.status === 'OK') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return {
        success: true,
        message: response.data.message,
        token: response.data.token,
        user: response.data.user
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Ошибка входа'
      };
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка соединения с сервером'
    };
  }
};

// Выход
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Получение текущего пользователя
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Проверка авторизации
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Получение токена
export const getToken = () => {
  return localStorage.getItem('token');
};

// Обновление информации о пользователе
export const updateUserInStorage = (userData) => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
  return null;
};

// Проверка токена (можно добавить проверку срока действия)
export const validateToken = async () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const response = await api.get('/auth/me');
    return response.data.status === 'OK';
  } catch (error) {
    // Если токен невалидный - разлогиниваем
    if (error.response?.status === 401) {
      logout();
    }
    return false;
  }
};