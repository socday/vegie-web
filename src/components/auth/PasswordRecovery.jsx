import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/PasswordRecovery.css';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/stage-notification');
  };

  return (
    <div className="recovery-page">
      <div className ="recovery-container">
        <div className="veggie-logo-large">
          <h1>Vegie</h1>
        </div>
        
        <div className="recovery-card">
          <div className="recovery-header">
            <h2>Khôi phục mật khẩu</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="recovery-form">
            <div className="form-group">
              <input
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email / số điện thoại đã đăng ký"
                required
              />
            </div>
            
            <div className="button-container">
              <button type="submit" className="recovery-button">
                Tiếp tục
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;