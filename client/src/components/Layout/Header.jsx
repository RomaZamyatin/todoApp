import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/auth';
import './Layout.css';

const Header = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-check-circle logo-icon"></i>
        <h1 className="logo-title">TodoList</h1>
      </div>
      <div className="user-info">
        <span className="username">
          {user ? `${user.firstName} ${user.lastName}` : 'Пользователь'}
        </span>
        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Выйти"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;