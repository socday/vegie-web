import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import { useSearchParams } from "react-router-dom";
import { getCustomer } from "../../../../router/authApi";
import { Customer } from "../../../../router/types/authResponse";

export default function ProfileSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || "profile";

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await getCustomer();
        const user = response.data ?? response;
        const mappedCustomer: Customer = {

          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          imgURL: user.imgURL,
        };
        setCustomer(mappedCustomer);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (confirmLogout) {
      localStorage.clear();
      alert("Đăng xuất thành công!");
      window.location.href = "/dang-nhap";
    }
  };

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

  return (
    <div className="sidebar">
      <div className="profile-pic">
        {customer?.imgURL ? (
          <img
            src={customer.imgURL}
            alt="Avatar"
            className="sidebar-avatar-img"
          />
        ) : (
          <div className="no-avatar"></div>
        )}
      </div>

      <h3 className="username">
        {loading ? "Đang tải..." : customer?.fullName || "Chưa có tên"}
      </h3>

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