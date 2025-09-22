import "../styles/Profile.css";
type ChangePasswordProps = {
  onCancel: () => void;
};

export default function ProfileChangePassword({ onCancel }: ChangePasswordProps) {
  return (
    <div className="profile-form">
      <h2>Thông tin cá nhân</h2>
      <div className="form-fields">
        <input placeholder="Nhập mật khẩu cũ" type="password" />
        <input placeholder="Nhập mật khẩu mới" type="password" />
        <input placeholder="Nhập lại mật khẩu mới" type="password" />
      </div>
      <div className="profile-form-actions">
        <button className="d-btn d-btn-font"><span>Lưu</span></button>
        <button className="d-btn d-btn-font" onClick={onCancel}> <span>Hủy</span></button>
      </div>
    </div>
  );
}