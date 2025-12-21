import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import '../Todo/Todo.css';

const TaskForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    dueDate: '',
    tags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Введите название задачи');
      return;
    }
    
    // Преобразуем строку тегов в массив
    const taskData = {
      ...formData,
      tags: formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []
    };
    
    onSubmit(taskData);
    // Сброс формы
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      dueDate: '',
      tags: ''
    });
  };

  // Устанавливаем минимальную дату как сегодняшнюю
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="left-panel">
      <div className="add-task-card">
        <h2 className="panel-title">Новая задача</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="title"
            label=""
            value={formData.title}
            onChange={handleChange}
            placeholder="Что нужно сделать?"
            className="task-input"
            required
          />

          <div className="form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание (необязательно)"
              className="task-textarea"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Приоритет:</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="task-select"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Категория:</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="task-select"
              >
                <option value="general">Общие</option>
                <option value="work">Работа</option>
                <option value="study">Учёба</option>
                <option value="personal">Личное</option>
                <option value="health">Здоровье</option>
                <option value="finance">Финансы</option>
                <option value="shopping">Покупки</option>
                <option value="home">Дом</option>
                <option value="travel">Путешествия</option>
                <option value="hobby">Хобби</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Срок выполнения:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="task-date"
              min={today}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Теги (через запятую):</label>
            <Input
              type="text"
              name="tags"
              label=""
              value={formData.tags}
              onChange={handleChange}
              placeholder="важно, проект, дом..."
              className="task-input"
            />
            <div className="tags-hint">
              <small>Например: работа, срочно, проект</small>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon="plus"
            fullWidth
            className="add-btn"
          >
            Добавить задачу
          </Button>
        </form>
      </div>

      {/* Информационная карточка из прототипа */}
      <div className="info-card">
        <h3 className="info-title">
          <i className="fas fa-info-circle"></i>
          Быстрые подсказки
        </h3>
        <ul className="info-list">
          <li><strong>Теги:</strong> используйте для группировки задач</li>
          <li><strong>Категории:</strong> 10 вариантов на выбор</li>
          <li><strong>Приоритеты:</strong> от низкого до срочного</li>
          <li><strong>Поиск:</strong> ищите по тегам и названиям</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskForm;