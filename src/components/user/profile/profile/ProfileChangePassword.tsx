import { useState } from "react";
import "../styles/Profile.css";
import { changePassword } from "../../../../router/authApi";

type ChangePasswordProps = {
  onCancel: () => void;
};

export default function ProfileChangePassword({ onCancel }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setError("");

    // ✅ Simple validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({ password: newPassword, passwordConfirm: confirmPassword });
      alert("Đổi mật khẩu thành công!");
      onCancel();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-form">
      <h2>Thông tin cá nhân</h2>
      <div className="form-fields">
        <div className="form-password-fields">
          <input
            placeholder="Nhập mật khẩu cũ"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            placeholder="Nhập mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            placeholder="Nhập lại mật khẩu mới"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-pcp-text">{error}</div>}
      </div>


      <div className="profile-form-actions">
        <button
          className="d-btn d-btn-font"
          onClick={handleSave}
          disabled={isLoading}
        >
          <span>{isLoading ? "Đang lưu..." : "Lưu"}</span>
        </button>
        <button className="d-btn d-btn-font" onClick={onCancel}>
          <span>Hủy</span>
        </button>
      </div>
    </div>
  );
}