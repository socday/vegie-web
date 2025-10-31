import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/PasswordRecovery.css';
import { forgotPassword } from '../../router/authApi';
import { extractErrorMessage } from '../utils/extractErrorMessage';

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // ✅ type for input change event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // ✅ type for form submit event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      if (res.success !== true) {
        setError(`Không thể khôi phục mật khẩu. Vui lòng thử lại. ${extractErrorMessage(res.message)}`);
        return;
      }
      navigate('/noti/restore-password');
    } catch (err) {
      setError(`Không thể khôi phục mật khẩu. Vui lòng thử lại. ${extractErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-page">
      <div className="recovery-container">
        <div className="veggie-logo-large">
          <h1>Vegie</h1>
        </div>

        <div className="recovery-card">
          <div className="recovery-header">
            <h2>Khôi phục mật khẩu</h2>
          </div>

          <form onSubmit={handleSubmit} className="recovery-form">
            <div className="form-group pr-form-group">
              <input
                type="text"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email / số điện thoại đã đăng ký"
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="button-container">
              <button type="submit" className="recovery-button" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Tiếp tục'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
