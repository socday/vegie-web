import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Login.css';
import LoginRegisterForm from './LoginRegisterForm.tsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-page">

      <LoginRegisterForm mode ="login"/>
      <div className="login-right-section">
        <div className="login-right-card">
          <div className="login-header">
            <h2 className="head2">Đăng nhập</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email / Số điện thoại"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                required
              />
            </div>
            
            <div className= "form-actions">

              <button type="submit" className="d-btn-font d-btn">
                <span>Đăng nhập</span>
              </button>
              <Link to="/khoi-phuc-mat-khau" className="d-btn-font d-btn">
                <span>Quên mật khẩu</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;