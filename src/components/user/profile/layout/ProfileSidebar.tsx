import "../styles/Profile.css";
import { useSearchParams } from "react-router-dom";

export default function ProfileSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || "profile";

  const menuItems = [
    { key: "profile", label: "Thông tin cá nhân" },
    { key: "orders", label: "Đơn hàng" },
    { key: "services", label: "Gói dịch vụ" },
    { key: "health", label: "Phiếu sức khỏe" },
  ];

  const handleSelect = (key: string) => {
    setSearchParams({ section: key });
  };

  return (
    <div className="sidebar">
      <div className="profile-pic"></div>
      <h3 className="username">USER NAME</h3>

      {menuItems.map((item) => (
        <button
          key={item.key}
          className={`sidebar-btn d-btn-font ${
            activeSection === item.key ? "active" : ""
          }`}
          onClick={() => handleSelect(item.key)}
        >
          {item.label}
        </button>
      ))}

      <div>
        <span className="sidebar-btn d-btn-font">
          Số điểm hiện tại: 100
        </span>
      </div>
      <div className="profile-sidebar-invincible"></div>
    </div>
  );
}