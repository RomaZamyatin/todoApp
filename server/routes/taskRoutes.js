const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// Все маршруты защищены аутентификацией
router.use(authMiddleware);

// Получить все задачи текущего пользователя
router.get('/', taskController.getAllTasks);

// Получить статистику по задачам
router.get('/stats', taskController.getTaskStats);

// Получить задачу по ID
router.get('/:id', taskController.getTaskById);

// Создать новую задачу
router.post('/', taskController.createTask);

// Обновить задачу
router.put('/:id', taskController.updateTask);

// Удалить задачу
router.delete('/:id', taskController.deleteTask);

// Переключить статус выполнения задачи
router.patch('/:id/toggle', taskController.toggleTaskCompletion);

module.exports = router;