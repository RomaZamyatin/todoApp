import api from './api';

// Получение всех задач пользователя
export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return {
      success: true,
      data: response.data.data,
      count: response.data.count
    };
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка при загрузке задач',
      data: []
    };
  }
};

// Получение статистики
export const getTaskStats = async () => {
  try {
    const response = await api.get('/tasks/stats');
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка при загрузке статистики'
    };
  }
};

// Получение задачи по ID
export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(`Ошибка при получении задачи ${taskId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка при загрузке задачи'
    };
  }
};

// Создание новой задачи
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка при создании задачи'
    };
  }
};

// Обновление задачи
export const updateTask = async (taskId, updates) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    console.error(`Ошибка при обновлении задачи ${taskId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка при обновлении задачи'
    };
  }
};

// Удаление задачи
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error(`Ошибка при удалении задачи ${taskId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка при удалении задачи'
    };
  }
};

// Переключение статуса выполнения
export const toggleTaskCompletion = async (taskId) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/toggle`);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    console.error(`Ошибка при изменении статуса задачи ${taskId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка при изменении статуса задачи'
    };
  }
};