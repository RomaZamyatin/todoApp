const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Получение текущего пользователя (защищённый маршрут)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;