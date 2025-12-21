import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>© 2025 TodoList - Управление задачами</p>
      </footer>
    </div>
  );
};

export default Layout;