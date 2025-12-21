import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import TaskForm from '../components/Todo/TaskForm';
import TaskList from '../components/Todo/TaskList';
import EditTaskModal from '../components/Todo/EditTaskModal';
import { getTasks, createTask, updateTask, deleteTask, toggleTaskCompletion, getTaskStats } from '../services/taskService';
import '../components/Todo/Todo.css';

const TodoPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    tags: 0
  });
  const [error, setError] = useState(null);

  // Загрузка задач при монтировании
  useEffect(() => {
    loadTasks();
  }, []);

  // Загрузка задач с сервера
  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const tasksResponse = await getTasks();
      const statsResponse = await getTaskStats();
      
      if (tasksResponse.success) {
        setTasks(tasksResponse.data || []);
      } else {
        setError(tasksResponse.message);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError('Ошибка при загрузке задач');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Добавление задачи
  const handleAddTask = async (taskData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await createTask(taskData);
      
      if (response.success) {
        // Добавляем новую задачу в начало списка
        setTasks(prev => [response.data, ...prev]);
        
        // Обновляем статистику
        const statsResponse = await getTaskStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Ошибка при создании задачи');
      console.error('Ошибка создания:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Переключение статуса выполнения
  const handleToggleComplete = async (taskId) => {
    setError(null);
    
    try {
      const response = await toggleTaskCompletion(taskId);
      
      if (response.success) {
        // Обновляем задачу в локальном состоянии
        setTasks(prev => prev.map(task => 
          task.id === taskId ? response.data : task
        ));
        
        // Обновляем статистику
        const statsResponse = await getTaskStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Ошибка при изменении статуса задачи');
      console.error('Ошибка изменения статуса:', err);
      return false;
    }
  };

  // Открытие модального окна редактирования
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  // Сохранение изменений задачи
  const handleUpdateTask = async (updatedTask) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updateTask(updatedTask.id, updatedTask);
      
      if (response.success) {
        // Обновляем задачу в локальном состоянии
        setTasks(prev => prev.map(task => 
          task.id === updatedTask.id ? response.data : task
        ));
        
        // Обновляем статистику
        const statsResponse = await getTaskStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        
        setShowEditModal(false);
        setEditingTask(null);
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Ошибка при обновлении задачи');
      console.error('Ошибка обновления:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Удаление задачи
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return false;
    }
    
    setError(null);
    
    try {
      const response = await deleteTask(taskId);
      
      if (response.success) {
        // Удаляем задачу из локального состояния
        setTasks(prev => prev.filter(task => task.id !== taskId));
        
        // Обновляем статистику
        const statsResponse = await getTaskStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError('Ошибка при удалении задачи');
      console.error('Ошибка удаления:', err);
      return false;
    }
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
  };

  // Расчет локальной статистики (на случай, если API не работает)
  const calculateLocalStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    
    const allTags = tasks.flatMap(task => task.tags || []);
    const uniqueTags = [...new Set(allTags)].length;
    
    return {
      total,
      active,
      completed,
      tags: uniqueTags
    };
  };

  // Используем статистику из API или локальную
  const currentStats = stats.total > 0 ? stats : calculateLocalStats();

  return (
    <Layout>
      <div className="main-content">
        {/* Левая панель - форма добавления задачи */}
        <TaskForm 
          onSubmit={handleAddTask}
          loading={loading}
        />
        
        {/* Правая панель - список задач */}
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          stats={currentStats}
          loading={loading}
        />
        
        {/* Сообщение об ошибке */}
        {error && (
          <div className="error-notification">
            <div className="error-content">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
              <button 
                className="error-close"
                onClick={() => setError(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования */}
      {showEditModal && editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleUpdateTask}
          onClose={handleCloseModal}
          loading={loading}
        />
      )}
    </Layout>
  );
};

export default TodoPage;