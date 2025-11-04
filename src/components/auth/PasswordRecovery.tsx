import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/PasswordRecovery.css";
import { forgotPassword, resetPasswordForm } from "../../router/authApi";
import { extractErrorMessage } from "../utils/extractErrorMessage";

const PasswordRecovery: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isOtpStage, setIsOtpStage] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isOtpStage) {
        // === Stage 1: Request OTP ===
        const res = await forgotPassword(email);
        if (res.success !== true) {
          setError(`Không thể gửi OTP. ${res.message}`);
          return;
        }
        setIsOtpStage(true);
      } else {
        // === Stage 2: Reset Password ===
        if (newPassword !== confirmPassword) {
          setError("Mật khẩu không khớp");
          return;
        }

        const res = await resetPasswordForm({
          email,
          otpCode,
          newPassword,
          confirmPassword,
        });

        if (res.success !== true) {
          setError(`Khôi phục mật khẩu thất bại. ${res.message}`);
          return;
        }

        // success
        navigate("/dang-nhap");
      }
    } catch (err) {
      setError(extractErrorMessage(err));
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
            {/* Email */}
            <div className="form-group pr-form-group">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email / số điện thoại đã đăng ký"
                required
                disabled={isOtpStage} // disable after OTP sent
              />
            </div>

            {/* OTP + Password Fields (Stage 2) */}
            {isOtpStage && (
              <>
                <div className="form-group pr-form-group">
                  <input
                    type="text"
                    name="otpCode"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Nhập mã OTP"
                    required
                  />
                </div>

                <div className="form-group pr-form-group">
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới"
                    required
                  />
                </div>

                <div className="form-group pr-form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    required
                  />
                </div>
              </>
            )}

            {/* Error */}
            {error && <p className="error-text">{error}</p>}

            <div className="button-container">
              <button type="submit" className="recovery-button" disabled={loading}>
                {loading
                  ? isOtpStage
                    ? "Đang khôi phục..."
                    : "Đang gửi OTP..."
                  : isOtpStage
                  ? "Đặt lại mật khẩu"
                  : "Tiếp tục"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
