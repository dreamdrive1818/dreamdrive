import React from 'react';
import './AdminLogin.css'; // Fix: use ./ for relative path

const AdminLogin = () => {
  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form className="admin-login-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
