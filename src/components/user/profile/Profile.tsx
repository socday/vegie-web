import { useState } from "react";
import ProfileForm from "./profile/ProfileForm";
import ProfileChangePassword from "./profile/ProfileChangePassword";
import ProfileSidebar from "./layout/ProfileSidebar";
import "./styles/Profile.css"
import Orders from "./order/order";

export default function Profile() {
  const [section, setSection] = useState("profile");

  // if section is change-password, still mark profile as active in sidebar
  const sidebarActive = section === "change-password" ? "profile" : section;

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <ProfileSidebar onSelect={setSection} activeSection={sidebarActive} />
      </div>
      <div className="profile-information">
        {section === "profile" && (
          <ProfileForm onChangePassword={() => setSection("change-password")} />
        )}
        {section === "orders" && (
          <Orders/>
        )}
        {section === "services" && <div>🛠 Đây là Gói dịch vụ</div>}
        {section === "groups" && <div>👥 Đây là Đơn nhóm</div>}
        {section === "health" && <div>🩺 Đây là Phiếu sức khỏe</div>}
        {section === "change-password" && (
          <ProfileChangePassword onCancel={() => setSection("profile")} />
        )}
      </div>
    </div>
  );
}