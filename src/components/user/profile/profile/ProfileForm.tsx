import "../styles/Profile.css";

type ProfileFormProps = {
  onChangePassword: () => void;
};

export default function ProfileForm({ onChangePassword }: ProfileFormProps) {
  return (
    <div className="profile-form">
      <h2>Thông tin cá nhân</h2>
      <div className="profile-form-show">

        <div className="profile-row">
          <div className="avatar"></div>
          <button className="d-btn d-btn-font"><span>Tải ảnh lên </span></button>
        </div>

        <div className="form-fields">
          <div className="profile-layout">
          <input placeholder="Họ" className="p1"/>
          <input placeholder="Tên" className="p2"/>
          </div>

          <div className="profile-layout">
          <input placeholder="Số điện thoại" className="p1"/>
          <input placeholder="Dd/mm/yy" className="p2"/>
          </div>
          
          <input placeholder="Email" className="full-width" />
          <input placeholder="Địa chỉ" className="full-width" />
        </div>
      </div>
      <div className="profile-form-actions">
        <button className="d-btn d-btn-font" onClick={onChangePassword}><span>Tạo mật khẩu mới</span></button>
        <button className="d-btn d-btn-font"><span>Lưu</span></button>
        <button className="d-btn d-btn-font"><span>Hủy</span></button>
      </div>
    </div>
  );
}