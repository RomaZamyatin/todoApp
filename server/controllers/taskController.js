const Task = require('../models/Task');
const User = require('../models/User');

// Получить все задачи текущего пользователя
const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const tasks = await Task.findAll({
      where: { userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      status: 'OK',
      message: 'Задачи успешно получены',
      data: tasks,
      count: tasks.length
    });

  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при получении задач',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получить статистику по задачам
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Общее количество задач
    const totalTasks = await Task.count({ where: { userId } });
    
    // Активные задачи (не выполненные)
    const activeTasks = await Task.count({ 
      where: { 
        userId, 
        completed: false 
      } 
    });
    
    // Выполненные задачи
    const completedTasks = totalTasks - activeTasks;
    
    // Получаем все теги
    const tasksWithTags = await Task.findAll({
      where: { userId },
      attributes: ['tags']
    });
    
    // Считаем уникальные теги
    const allTags = tasksWithTags.flatMap(task => task.tags || []);
    const uniqueTagsCount = [...new Set(allTags)].length;
    
    // Считаем задачи по приоритетам
    const priorityStats = {};
    const priorities = ['urgent', 'high', 'medium', 'low'];
    
    for (const priority of priorities) {
      priorityStats[priority] = await Task.count({
        where: { 
          userId, 
          priority,
          completed: false 
        }
      });
    }

    res.json({
      status: 'OK',
      message: 'Статистика успешно получена',
      data: {
        total: totalTasks,
        active: activeTasks,
        completed: completedTasks,
        tags: uniqueTagsCount,
        priorities: priorityStats
      }
    });

  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при получении статистики',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получить задачу по ID
const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    
    const task = await Task.findOne({
      where: { 
        id: taskId,
        userId 
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    if (!task) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Задача не найдена'
      });
    }

    res.json({
      status: 'OK',
      message: 'Задача успешно получена',
      data: task
    });

  } catch (error) {
    console.error('Ошибка при получении задачи:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при получении задачи',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Создать новую задачу
const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      title, 
      description, 
      priority = 'medium', 
      category = 'general', 
      tags = [], 
      dueDate 
    } = req.body;

    // Валидация обязательных полей
    if (!title || !title.trim()) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Название задачи обязательно'
      });
    }

    // Валидация приоритета
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Некорректный приоритет'
      });
    }

    // Валидация категории
    const validCategories = ['general', 'work', 'study', 'personal', 'health', 'finance', 'shopping', 'home', 'travel', 'hobby'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Некорректная категория'
      });
    }

    const task = await Task.create({
      userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      priority,
      category,
      tags: Array.isArray(tags) ? tags : [],
      dueDate: dueDate || null,
      completed: false
    });

    // Получаем задачу с пользователем для ответа
    const taskWithUser = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.status(201).json({
      status: 'OK',
      message: 'Задача успешно создана',
      data: taskWithUser
    });

  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при создании задачи',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Обновить задачу
const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    const updates = req.body;

    // Находим задачу
    const task = await Task.findOne({
      where: { 
        id: taskId,
        userId 
      }
    });

    if (!task) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Задача не найдена'
      });
    }

    // Если обновляется статус выполнения, устанавливаем дату выполнения
    if (updates.completed !== undefined) {
      updates.completedAt = updates.completed ? new Date() : null;
    }

    // Обновляем задачу
    await task.update({
      ...updates,
      updated_at: new Date()
    });

    // Получаем обновленную задачу с пользователем
    const updatedTask = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.json({
      status: 'OK',
      message: 'Задача успешно обновлена',
      data: updatedTask
    });

  } catch (error) {
    console.error('Ошибка при обновлении задачи:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при обновлении задачи',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Удалить задачу
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOne({
      where: { 
        id: taskId,
        userId 
      }
    });

    if (!task) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Задача не найдена'
      });
    }

    await task.destroy();

    res.json({
      status: 'OK',
      message: 'Задача успешно удалена'
    });

  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при удалении задачи',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Переключить статус выполнения задачи
const toggleTaskCompletion = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.findOne({
      where: { 
        id: taskId,
        userId 
      }
    });

    if (!task) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Задача не найдена'
      });
    }

    // Переключаем статус
    const newCompletedStatus = !task.completed;
    
    await task.update({
      completed: newCompletedStatus,
      completedAt: newCompletedStatus ? new Date() : null,
      updated_at: new Date()
    });

    // Получаем обновленную задачу
    const updatedTask = await Task.findByPk(task.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }]
    });

    res.json({
      status: 'OK',
      message: newCompletedStatus ? 'Задача отмечена как выполненная' : 'Задача отмечена как активная',
      data: updatedTask
    });

  } catch (error) {
    console.error('Ошибка при изменении статуса задачи:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при изменении статуса задачи',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion
};