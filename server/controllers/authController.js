const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Изменил эту строку

// Регистрация нового пользователя
const register = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Проверка на существующего пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Создание пользователя
    const user = await User.create({
      email,
      firstName,
      lastName,
      passwordHash: password
    });

    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Убираем пароль из ответа
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.created_at
    };

    res.status(201).json({
      status: 'OK',
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при регистрации пользователя',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Вход пользователя
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Неверный email или пароль'
      });
    }

    // Проверка пароля
    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Неверный email или пароль'
      });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Убираем пароль из ответа
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.created_at
    };

    res.json({
      status: 'OK',
      message: 'Вход выполнен успешно',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при входе в систему',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Получение текущего пользователя по токену
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Пользователь не авторизован'
      });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.created_at
    };

    res.json({
      status: 'OK',
      user: userResponse
    });

  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Ошибка при получении данных пользователя',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};