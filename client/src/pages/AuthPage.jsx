import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { isAuthenticated } from '../services/auth';
import '../styles/auth.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Если пользователь уже авторизован - редирект на главную
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      {/* Левая часть - информация */}
      <div className="auth-info-section">
        <div className="auth-info-content">
          <div className="auth-logo">
            <i className="fas fa-check-circle"></i>
            <h1>TodoList</h1>
          </div>
          <p className="auth-tagline">Простое управление вашими задачами</p>
          
          <div className="auth-features">
            <div className="auth-feature">
              <i className="fas fa-plus-circle"></i>
              <span>Создавайте задачи</span>
            </div>
            <div className="auth-feature">
              <i className="fas fa-check-circle"></i>
              <span>Отмечайте выполненные</span>
            </div>
            <div className="auth-feature">
              <i className="fas fa-tags"></i>
              <span>Организуйте по категориям</span>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть - форма */}
      <div className="auth-form-section">
        {isLoginPage ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default AuthPage;