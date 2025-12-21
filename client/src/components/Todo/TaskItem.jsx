import React from 'react';
import '../Todo/Todo.css';

// Вспомогательные функции из прототипа
const getPriorityName = (priority) => {
  switch (priority) {
    case 'urgent': return 'Срочный';
    case 'high': return 'Высокий';
    case 'medium': return 'Средний';
    case 'low': return 'Низкий';
    default: return 'Низкий';
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'urgent': return 'priority-urgent';
    case 'high': return 'priority-high';
    case 'medium': return 'priority-medium';
    case 'low': return 'priority-low';
    default: return 'priority-low';
  }
};

const getCategoryName = (category) => {
  const names = {
    'general': 'Общие',
    'work': 'Работа',
    'study': 'Учёба',
    'personal': 'Личное',
    'health': 'Здоровье',
    'finance': 'Финансы',
    'shopping': 'Покупки',
    'home': 'Дом',
    'travel': 'Путешествия',
    'hobby': 'Хобби'
  };
  return names[category] || category;
};

const getCategoryClass = (category) => `category-${category}`;

const formatDate = (dateString) => {
  if (!dateString) return 'Без срока';
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);
  
  // Проверка на просроченность
  const isOverdue = taskDate < today && !taskDate.getTime() === today.getTime();
  
  // Форматирование
  if (taskDate.getTime() === today.getTime()) {
    return 'Сегодня';
  } else if (taskDate.getTime() === tomorrow.getTime()) {
    return 'Завтра';
  } else {
    const options = { day: 'numeric', month: 'short' };
    if (taskDate.getFullYear() !== today.getFullYear()) {
      options.year = 'numeric';
    }
    return date.toLocaleDateString('ru-RU', options) + (isOverdue ? ' (просрочено)' : '');
  }
};

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <div 
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(task.id)}
        >
          {task.completed && <i className="fas fa-check"></i>}
        </div>
        
        <div className="task-content">
          <div className="task-title-row">
            <div className="task-title" title={task.title}>
              {task.title}
            </div>
            <div 
              className={`task-priority ${getPriorityClass(task.priority)}`}
              title={`${getPriorityName(task.priority)} приоритет`}
            >
              {getPriorityName(task.priority)}
            </div>
          </div>
          
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span key={index} className="tag" title={tag}>
                  <i className="fas fa-hashtag"></i>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="task-meta">
            <div>
              <span 
                className={`task-category ${getCategoryClass(task.category)}`}
                title={`Категория: ${getCategoryName(task.category)}`}
              >
                <i className="fas fa-folder"></i>
                {getCategoryName(task.category)}
              </span>
            </div>
            
            <div 
              className={`task-due ${isOverdue ? 'overdue' : ''}`}
              title={task.dueDate ? 'Срок выполнения' : 'Без срока'}
            >
              <i className="far fa-calendar"></i>
              {formatDate(task.dueDate)}
            </div>
          </div>
        </div>
        
        <div className="task-actions">
          <button 
            className="action-btn edit"
            onClick={() => onEdit(task)}
            title="Редактировать задачу"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="action-btn delete"
            onClick={() => onDelete(task.id)}
            title="Удалить задачу"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;