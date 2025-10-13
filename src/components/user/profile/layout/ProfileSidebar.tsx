import "../styles/Profile.css";

type SidebarProps = {
  onSelect: (section: string) => void;
  activeSection: string;
};

export default function ProfileSidebar({ onSelect, activeSection }: SidebarProps) {
  const menuItems = [
    { key: "profile", label: "Thông tin cá nhân" },
    { key: "orders", label: "Đơn hàng" },
    { key: "services", label: "Gói dịch vụ" },
    { key: "groups", label: "Đơn nhóm" },
    { key: "health", label: "Phiếu sức khỏe" },

  ];

  return (
    <div className="sidebar">
      <div className="profile-pic"></div>
      <h3 className="username">USER NAME</h3>

      {menuItems.map((item) => (
        <button
          key={item.key}
          className={`sidebar-btn d-btn-font ${activeSection === item.key ? "active" : ""}`}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
      <div>
        <span className="sidebar-btn d-btn-font">Số điểm hiện tại: 100
          
        </span>
      </div>
      <div className="profile-sidebar-invincible"></div>
    </div>
  );
}