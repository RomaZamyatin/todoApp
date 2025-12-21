const { Sequelize } = require('sequelize');
require('dotenv').config();

// Создаем экземпляр Sequelize для подключения к PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,      // имя базы данных
  process.env.DB_USER,      // имя пользователя
  process.env.DB_PASSWORD,  // пароль
  {
    host: process.env.DB_HOST,    // хост
    port: process.env.DB_PORT,    // порт
    dialect: 'postgres',          // диалект БД
    logging: false,               // отключаем логи SQL запросов в консоль
    pool: {
      max: 5,                     // максимальное количество соединений в пуле
      min: 0,                     // минимальное количество соединений
      acquire: 30000,             // максимальное время ожидания соединения (мс)
      idle: 10000                 // время простоя перед закрытием (мс)
    }
  }
);

// Функция для тестирования подключения
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL подключена успешно');
    return sequelize;
  } catch (error) {
    console.error('❌ Ошибка подключения к PostgreSQL:', error.message);
    process.exit(1); // Завершаем процесс при ошибке подключения
  }
};

module.exports = { sequelize, connectDB };
