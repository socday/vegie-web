import { useState } from "react";
import ProfileForm from "./profile/ProfileForm";
import ProfileChangePassword from "./profile/ProfileChangePassword";
import ProfileSidebar from "./layout/ProfileSidebar";
import "./styles/Profile.css"
import Orders from "./order/Order";
import ReviewOrderForm from "./order/ReviewOrderForm";
import Subscription from "./subscription/Subscription";
import PersonalHealth from "./personal-health/PersonalHealth";

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
        {section === "services" && (
          <Subscription/>
        )}
        {section === "groups" && <div>Đây là Đơn nhóm</div>}
        {section === "health" && 
          <PersonalHealth/>}
        {section === "change-password" && (
          <ProfileChangePassword onCancel={() => setSection("profile")} />
        )}
        {section === "review-order-form" && (
          <ReviewOrderForm />
        )}
      </div>
    </div>
  );
}