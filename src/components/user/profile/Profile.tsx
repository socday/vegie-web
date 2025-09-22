import { useState } from "react";
import ProfileForm from "./logic/ProfileForm";
import ProfileChangePassword from "./logic/ProfileChangePassword";
import ProfileSidebar from "./layout/ProfileSidebar";
import "./styles/Profile.css"

export default function Profile() {
  const [section, setSection] = useState("profile");

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <ProfileSidebar onSelect={setSection} activeSection={section} />
      </div>
      <div className="profile-information">
        {section === "profile" && <ProfileForm onChangePassword={() => setSection("change-password")} />}
        {section === "orders" && <div> Đây là Đơn hàng</div>}
        {section === "services" && <div> Đây là Gói dịch vụ</div>}
        {section === "groups" && <div> Đây là Đơn nhóm</div>}
        {section === "health" && <div> Đây là Phiếu sức khỏe</div>}
        {section === "change-password" && <ProfileChangePassword onCancel={() => setSection("profile")} />}
      </div>
    </div>
  );
}