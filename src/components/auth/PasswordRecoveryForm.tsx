import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Register.css";
import "../../index.css";
import { useMediaQuery } from "react-responsive";
import { resetPasswordForm } from "../../router/authApi";

const PasswordRecoveryForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await resetPasswordForm({
        email: formData.email,
        otpCode: formData.otpCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (res.isSuccess === true) {
        setSuccess(true);
        console.log("Khôi phục mật khẩu thành công:", res);
        navigate("/dang-nhap");
      } else {
        setError(res.message || "Khôi phục mật khẩu thất bại");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khôi phục mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  return (
    <div className="register-page">
      {isMobile && <h1 className="head1">Vegie</h1>}

      <div className="register-left-section">
        <div className="register-left-card">
          <h2 className="head2">Khôi phục mật khẩu</h2>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            {/* OTP Code */}
            <div className="form-group otp-coupon-group">
              <div className="coupon-form-group">
                <span className="r-coupon-text">
                  <p className="r-coupon-text-visible">Mã OTP</p>
                </span>
                <input
                  type="text"
                  name="otpCode"
                  value={formData.otpCode}
                  onChange={handleChange}
                  placeholder="Nhập mã OTP"
                  className="inputCoupon"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Mật khẩu mới"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu mới"
                required
              />
            </div>

            {/* Errors / Success */}
            {error && <p className="error">{error}</p>}
            {success && (
              <p className="success">Khôi phục mật khẩu thành công!</p>
            )}

            {/* Actions */}
            <div className="form-actions">
              <button type="submit" className="d-btn d-btn-font" disabled={loading}>
                <span>{loading ? "Đang xử lý..." : "Xác nhận"}</span>
              </button>

              {isMobile && (
                <Link to="/dang-nhap" className="d-btn d-btn-font lr-link-btn">
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryForm;
