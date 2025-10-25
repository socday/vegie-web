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
    { key: "logout", label: "Đăng xuất" },
  ];

  const handleSelect = (key: string) => {
    if (key === "logout") {
      handleLogout();
    } else {
      setSearchParams({ section: key });
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (confirmLogout) {
      localStorage.clear(); // Xoá toàn bộ dữ liệu trong localStorage
      alert("Đăng xuất thành công!");
      window.location.href = "/dang-nhap"; // Chuyển hướng về trang đăng nhập
    } else {
      alert("Huỷ đăng xuất.");
    }
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