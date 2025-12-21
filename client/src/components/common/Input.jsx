import React from 'react';
import './Input.css';

const Input = ({ 
  type = 'text', 
  label, 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon,
  required = false,
  ...props 
}) => {
  const inputId = `input-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId}>
          {icon && <i className={`fas fa-${icon}`}></i>}
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
        required={required}
        {...props}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;