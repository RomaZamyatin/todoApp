import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import '../Todo/Todo.css';

const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  stats,
  loading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Фильтрация и поиск задач
  useEffect(() => {
    let filtered = [...tasks];

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        (task.tags && task.tags.some(tag => 
          tag.toLowerCase().includes(query)
        ))
      );
    }

    // Фильтрация по статусу
    if (currentFilter === 'active') {
      filtered = filtered.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (currentFilter === 'urgent') {
      filtered = filtered.filter(task => 
        task.priority === 'urgent' && !task.completed
      );
    }

    // Сортировка по приоритету (срочные сначала)
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, currentFilter]);

  // Функция для очистки поиска
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Функция для отображения пустого состояния
  const renderEmptyState = () => {
    if (searchQuery) {
      return (
        <div className="empty-state">
          <i className="fas fa-search empty-icon"></i>
          <h3>Задачи не найдены</h3>
          <p>Попробуйте другой поисковый запрос</p>
          <button 
            onClick={handleClearSearch}
            className="clear-search-btn"
          >
            Очистить поиск
          </button>
        </div>
      );
    }

    return (
      <div className="empty-state">
        <i className="fas fa-tasks empty-icon"></i>
        <h3>Нет задач</h3>
        <p>Добавьте свою первую задачу</p>
      </div>
    );
  };

  return (
    <div className="right-panel">
      <div className="tasks-header">
        <h2 className="panel-title">Мои задачи</h2>
        
        <div className="tasks-controls">
          {/* Поиск */}
          <div className="search-box">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Поиск по задачам и тегам..."
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-input-btn"
                onClick={handleClearSearch}
                title="Очистить поиск"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          {/* Фильтры */}
          <div className="filter-tabs">
            <button 
              className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('all')}
              data-filter="all"
            >
              Все
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('active')}
              data-filter="active"
            >
              Активные
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('completed')}
              data-filter="completed"
            >
              Выполненные
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'urgent' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('urgent')}
              data-filter="urgent"
            >
              Срочные
            </button>
          </div>
        </div>
      </div>
      
      {/* Список задач */}
      <div className="tasks-list">
        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin loading-icon"></i>
            <p>Загрузка задач...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          renderEmptyState()
        )}
      </div>
      
      {/* Статистика */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-count">{stats.total || 0}</span>
          <span className="stat-label">Всего задач</span>
        </div>
        <div className="stat-item">
          <span className="stat-count">{stats.active || 0}</span>
          <span className="stat-label">Активных</span>
        </div>
        <div className="stat-item">
          <span className="stat-count">{stats.completed || 0}</span>
          <span className="stat-label">Выполнено</span>
        </div>
        <div className="stat-item">
          <span className="stat-count">{stats.tags || 0}</span>
          <span className="stat-label">Тегов</span>
        </div>
      </div>
    </div>
  );
};

export default TaskList;