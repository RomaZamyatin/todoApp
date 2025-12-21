const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.STRING, // ВМЕСТО DataTypes.ENUM
    defaultValue: 'medium',
    validate: {
    isIn: [['low', 'medium', 'high', 'urgent']]
  }
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'general',
    validate: {
      isIn: [['general', 'work', 'study', 'personal', 'health', 'finance', 'shopping', 'home', 'travel', 'hobby']]
    }
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'due_date'
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Task;

Task.associate = (models) => {
  Task.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};
