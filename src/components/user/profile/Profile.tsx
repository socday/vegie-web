import { useEffect, useState } from "react";
import ProfileForm from "./profile/ProfileForm";
import ProfileChangePassword from "./profile/ProfileChangePassword";
import ProfileSidebar from "./layout/ProfileSidebar";
import "./styles/Profile.css";
import Orders from "./order/Order";
import ReviewOrderForm from "./order/ReviewOrderForm";
import Subscription from "./subscription/Subscription";
import PersonalHealth from "./personal-health/PersonalHealth";
import { useMediaQuery } from "react-responsive";

export default function Profile() {
  const [section, setSection] = useState("profile");

  const sidebarActive = section === "change-password" ? "profile" : section;

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  useEffect(() => {
    if (isMobile) {
      setSection("sidebar");
    }
  }, [isMobile]);
  return (
    <div className="profile-page">
      {isDesktop && (
        <>
          <div className="profile-sidebar">
            <ProfileSidebar onSelect={setSection} activeSection={sidebarActive} />
          </div>

          <div className="profile-information">
            {section === "profile" && (
              <ProfileForm onChangePassword={() => setSection("change-password")} />
            )}
            {section === "orders" && <Orders />}
            {section === "services" && <Subscription />}
            {section === "groups" && <div>Đây là Đơn nhóm</div>}
            {section === "health" && <PersonalHealth />}
            {section === "change-password" && (
              <ProfileChangePassword onCancel={() => setSection("profile")} />
            )}
            {section === "review-order-form" && <ReviewOrderForm />}
          </div>
        </>
      )}
      {isMobile && (
        <>
          {section === "sidebar" && (
            <ProfileSidebar onSelect={setSection} activeSection={sidebarActive} />
          )}

          {section !== "sidebar" && (
            <div className="profile-information">
              <button
                className="back-btn"
                onClick={() => setSection("sidebar")}
              >
                ← Quay lại
              </button>

              {section === "profile" && (
                <ProfileForm onChangePassword={() => setSection("change-password")} />
              )}
              {section === "orders" && <Orders />}
              {section === "services" && <Subscription />}
              {section === "groups" && <div>Đây là Đơn nhóm</div>}
              {section === "health" && <PersonalHealth />}
              {section === "change-password" && (
                <ProfileChangePassword onCancel={() => setSection("profile")} />
              )}
              {section === "review-order-form" && <ReviewOrderForm />}
            </div>
          )}
        </>
      )}
    </div>
  );
}