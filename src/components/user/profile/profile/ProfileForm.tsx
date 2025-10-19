import { useMediaQuery } from "react-responsive";
import "../styles/Profile.css";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

type ProfileFormProps = {
  onChangePassword: () => void;
};

export default function ProfileForm({ onChangePassword }: ProfileFormProps) {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });
  return (
    <div className="profile-form">
      <h2>Thông tin cá nhân</h2>
      <div className="profile-form-show">
        {isDesktop &&
        <>
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
          </>
          } 
      </div>
      <div className="profile-form-show">
        {isMobile && <>
        <div className="profile-row">
          <div className="profile-mobile-display">
            <div className="p-mobile-avatar">
              <div className="avatar"></div>
              <button className="d-btn d-btn-font"><span>Tải ảnh lên</span></button>
            </div>

            <div className="form-fields">
              <input placeholder="Họ" className="p1" />
              <input placeholder="Tên" className="p2" />
              <input placeholder="Số điện thoại" className="p1" />
              <input placeholder="Dd/mm/yy" className="p2" />
            </div>
          </div>

          <div className="form-fields">
            <input placeholder="Email" className="full-width" />
            <input placeholder="Địa chỉ" className="full-width" />
          </div>
        </div>
        </>}
      </div>
      <div className="profile-form-actions">
        <button className="d-btn d-btn-font" onClick={onChangePassword}><span>Tạo mật khẩu mới</span></button>
        <button className="d-btn d-btn-font"><span>Lưu</span></button>
        <button className="d-btn d-btn-font"><span>Hủy</span></button>
      </div>
    </div>
  );
}

