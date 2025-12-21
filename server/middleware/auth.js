const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Изменил эту строку

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Токен не предоставлен'
      });
    }

    // Проверка токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Поиск пользователя
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Пользователь не найден'
      });
    }

    // Добавляем пользователя в запрос
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Неверный токен'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Токен истёк'
      });
    }

    console.error('Ошибка аутентификации:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при проверке авторизации'
    });
  }
};

module.exports = authMiddleware;