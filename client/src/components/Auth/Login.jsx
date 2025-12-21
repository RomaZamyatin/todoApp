import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { login } from '../../services/auth';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await login(formData);
      
      if (response.success) {
        // Сохраняем токен
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Если выбрано "Запомнить меня"
        if (formData.remember) {
          localStorage.setItem('remember', 'true');
        }
        
        // Перенаправляем на главную
        navigate('/');
      } else {
        setErrors({ general: response.message || 'Ошибка входа' });
      }
    } catch (error) {
      setErrors({ general: 'Ошибка соединения с сервером' });
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-form-container">
      <h2>Вход в аккаунт</h2>
      <p className="auth-subtitle">Введите ваши учетные данные</p>
      
      {errors.general && (
        <div className="error-message general">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          type="email"
          name="email"
          label="Email"
          icon="envelope"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          error={errors.email}
          required
        />
        
        <div className="input-group">
          <label htmlFor="password">
            <i className="fas fa-lock"></i>
            Пароль
          </label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              className={errors.password ? 'error' : ''}
              required
            />
            <button 
              type="button" 
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
            </button>
          </div>
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>
        
        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Запомнить меня
          </label>
        </div>
        
        <Button 
          type="submit" 
          variant="primary"
          loading={loading}
          icon="sign-in-alt"
          fullWidth
        >
          Войти
        </Button>
        
        <div className="auth-footer">
          <p>
            Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;