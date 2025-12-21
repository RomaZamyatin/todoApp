import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { register } from '../../services/auth';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'Необходимо согласие с условиями';
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
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      };
      
      const response = await register(userData);
      
      if (response.success) {
        alert('Регистрация успешна! Теперь вы можете войти.');
        navigate('/login');
      } else {
        setErrors({ general: response.message || 'Ошибка регистрации' });
      }
    } catch (error) {
      setErrors({ general: 'Ошибка соединения с сервером' });
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="auth-form-container">
      <h2>Создать аккаунт</h2>
      <p className="auth-subtitle">Заполните форму для регистрации</p>
      
      {errors.general && (
        <div className="error-message general">{errors.general}</div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <Input
            type="text"
            name="firstName"
            label="Имя"
            icon="user"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Иван"
            error={errors.firstName}
            required
          />
          
          <Input
            type="text"
            name="lastName"
            label="Фамилия"
            icon="user"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Иванов"
            error={errors.lastName}
            required
          />
        </div>
        
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
              placeholder="Придумайте пароль"
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
          <div className="password-hint">
            <small>Пароль должен содержать не менее 6 символов</small>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="confirmPassword">
            <i className="fas fa-lock"></i>
            Подтвердите пароль
          </label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите пароль"
              className={errors.confirmPassword ? 'error' : ''}
              required
            />
            <button 
              type="button" 
              className="show-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
            </button>
          </div>
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>
        
        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              required
            />
            <span className="checkmark"></span>
            Я согласен с <Link to="/terms" className="terms-link">условиями использования</Link>
          </label>
          {errors.terms && <div className="error-message">{errors.terms}</div>}
        </div>
        
        <Button 
          type="submit" 
          variant="primary"
          loading={loading}
          icon="user-plus"
          fullWidth
        >
          Зарегистрироваться
        </Button>
        
        <div className="auth-footer">
          <p>
            Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;