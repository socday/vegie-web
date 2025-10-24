import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import ProfileForm from "./profile/ProfileForm";
import ProfileChangePassword from "./profile/ProfileChangePassword";
import ProfileSidebar from "./layout/ProfileSidebar";
import "./styles/Profile.css";
import Orders from "./order/Order";
import Subscription from "./subscription/Subscription";
import PersonalHealth from "./personal-health/PersonalHealth";
import { useMediaQuery } from "react-responsive";
import { useOrders } from "../../../context/OrderContext";
import LogoutButton from "./logout/LogoutButton";

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const section = searchParams.get("section") || "profile";
  const { refreshOrders } = useOrders();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const handleChangeSection = (key: string) => {
    setSearchParams({ section: key });
  };

  useEffect(() => {
    if (!searchParams.get("section")) {
      setSearchParams({ section: "profile" });
    }
  }, []);

  return (
    <div className="profile-page">
      {isDesktop && (
        <>
          <div className="profile-sidebar">
            <ProfileSidebar />
          </div>

          <div className="profile-information">
            {section === "profile" && (
              <ProfileForm
                onChangePassword={() => handleChangeSection("change-password")}
              />
            )}
            {section === "orders" && <Orders />}
            {section === "services" && <Subscription />}
            {section === "health" && <PersonalHealth />}
            {section === "logout" && <LogoutButton />}
            {section === "change-password" && (
              <ProfileChangePassword
                onCancel={() => handleChangeSection("profile")}
              />
            )}
          </div>
        </>
      )}

      {isMobile && (
        <>
          {section === "sidebar" && <ProfileSidebar />}

          {section !== "sidebar" && (
            <div className="profile-information">
              <button
                className="back-btn"
                onClick={() => handleChangeSection("sidebar")}
              >
                ← Quay lại
              </button>

              {section === "profile" && (
                <ProfileForm
                  onChangePassword={() =>
                    handleChangeSection("change-password")
                  }
                />
              )}
              {section === "orders" && <Orders />}
              {section === "services" && <Subscription />}
              {section === "health" && <PersonalHealth />}
            {section === "logout" && <LogoutButton />}
              {section === "change-password" && (
                <ProfileChangePassword
                  onCancel={() => handleChangeSection("profile")}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}