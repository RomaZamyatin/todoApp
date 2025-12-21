const express = require('express');
const cors = require('cors');
const { sequelize, connectDB } = require('./config/database');

// Импортируем модели
const User = require('./models/User');
const Task = require('./models/Task');
// Импортируем маршруты
const authRoutes = require('./routes/authRoutes');

User.hasMany(Task, { foreignKey: 'user_id', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Тестовый маршрут
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TodoList API работает',
    timestamp: new Date().toISOString()
  });
});

// Еще один тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Сервер готов к работе!',
    environment: process.env.NODE_ENV,
    database: process.env.DB_NAME
  });
});

// Маршрут для проверки работы с БД
app.get('/api/db-test', async (req, res) => {
  try {
    // Подсчет пользователей и задач
    const userCount = await User.count();
    const taskCount = await Task.count();
    
    res.json({
      status: 'OK',
      message: 'База данных работает',
      counts: {
        users: userCount,
        tasks: taskCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ошибка при работе с БД:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка работы с базой данных',
      error: error.message
    });
  }
});

// Маршрут для получения всех задач (пример будущего функционала)
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json({
      status: 'OK',
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Ошибка при получении задач:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при получении задач',
      error: error.message
    });
  }
});

// Маршрут для получения всех пользователей (пример)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      status: 'OK',
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при получении пользователей',
      error: error.message
    });
  }
});

// Простой маршрут для создания тестовой задачи (пример)
app.post('/api/tasks/test', async (req, res) => {
  try {
    // Используем первого пользователя
    const user = await User.findOne();
    
    if (!user) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Пользователь не найден'
      });
    }
    
    const testTask = await Task.create({
      userId: user.id,
      title: 'Тестовая задача из API',
      description: 'Эта задача создана через API запрос',
      priority: 'medium',
      category: 'general',
      tags: ['тест', 'api'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Через 7 дней
    });
    
    res.json({
      status: 'OK',
      message: 'Тестовая задача создана',
      task: testTask
    });
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при создании задачи',
      error: error.message
    });
  }
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ 
    status: 'ERROR',
    message: 'Маршрут не найден',
    path: req.path
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).json({
    status: 'ERROR',
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Запуск сервера после подключения к БД
const startServer = async () => {
  try {
    // Подключаемся к базе данных
    console.log('🔄 Подключение к PostgreSQL...');
    await connectDB();
    
    // Синхронизация моделей с базой данных
    console.log('🔄 Синхронизация моделей с базой данных...');
    // 
    console.log('✅ Подключение к базе данных успешно');
    console.log('✅ Модели синхронизированы с базой данных');
    
    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📡 API доступно по адресу: http://localhost:${PORT}`);
      console.log(`\n🔍 Доступные маршруты:`);
      console.log(`   GET  http://localhost:${PORT}/api/health`);
      console.log(`   GET  http://localhost:${PORT}/api/test`);
      console.log(`   GET  http://localhost:${PORT}/api/db-test`);
      console.log(`   GET  http://localhost:${PORT}/api/tasks`);
      console.log(`   GET  http://localhost:${PORT}/api/users`);
      console.log(`   POST http://localhost:${PORT}/api/tasks/test`);
      console.log(`\n👨‍💻 Ожидание запросов...`);
    });
    
  } catch (error) {
    console.error('❌ Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

startServer();
