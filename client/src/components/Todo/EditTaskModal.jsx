import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import '../Todo/Todo.css';

const EditTaskModal = ({ task, onSave, onClose, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    dueDate: '',
    tags: '',
    completed: false
  });

  // Инициализация формы данными задачи
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        category: task.category || 'general',
        dueDate: task.dueDate || '',
        tags: task.tags ? task.tags.join(', ') : '',
        completed: task.completed || false
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Введите название задачи');
      return;
    }

    // Преобразуем строку тегов в массив
    const updatedTask = {
      ...task,
      ...formData,
      tags: formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : []
    };

    onSave(updatedTask);
  };

  // Закрытие по клику вне модального окна
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Устанавливаем минимальную дату как сегодняшнюю
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal show" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактировать задачу</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="editForm">
            <Input
              type="text"
              name="title"
              label=""
              value={formData.title}
              onChange={handleChange}
              placeholder="Название задачи"
              className="task-input"
              required
            />

            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Описание задачи"
                className="task-textarea"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Приоритет:</label>
                <select
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
                <label>Категория:</label>
                <select
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
              <label>Срок выполнения:</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="task-date"
                min={today}
              />
            </div>

            <div className="form-group">
              <label>Теги (через запятую):</label>
              <Input
                type="text"
                name="tags"
                label=""
                value={formData.tags}
                onChange={handleChange}
                placeholder="важно, проект, дом..."
                className="task-input"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Задача выполнена
              </label>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon="save"
              >
                Сохранить
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;