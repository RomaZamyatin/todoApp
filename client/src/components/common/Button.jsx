import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  onClick,
  icon,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${loading ? 'loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Загрузка...</span>
        </>
      ) : (
        <>
          {icon && <i className={`fas fa-${icon}`}></i>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;