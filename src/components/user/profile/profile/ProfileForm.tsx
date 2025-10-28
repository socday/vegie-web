import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "../styles/Profile.css";
import { Customer } from "../../../../router/types/authResponse";
import { getCustomer, updateCustomer } from "../../../../router/authApi";

type ProfileFormProps = {
  onChangePassword: () => void;
};

export default function ProfileForm({ onChangePassword }: ProfileFormProps) {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [originalCustomer, setOriginalCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // show preview
    }
  };
  // Fetch customer info on mount
useEffect(() => {
  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await getCustomer();

      // If response.data holds the actual customer
      const user = response.data ?? response;

      const mappedCustomer: Customer = {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName, 
        email: user.email,
        phone: user.phone,
        address: user.address,
        imgURL: user.imgURL,
      };

      setCustomer(mappedCustomer);
      setOriginalCustomer(mappedCustomer);
    } catch (error) {
      console.error("Failed to fetch customer:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchCustomer();
}, []);

  // Handle input change
  const handleChange = (field: keyof Customer, value: string) => {
    setCustomer((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // Save to API
  const handleSave = async () => {
  if (!customer) return;
  try {
    const formData = new FormData();
    formData.append("firstName", customer.fullName);
    formData.append("lastName", "");
    formData.append("phoneNumber", customer.phone);
    formData.append("gender", "0");
    formData.append("address", customer.address);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const updated = await updateCustomer(formData); // updateCustomer must send multipart
    setCustomer(updated);
    setOriginalCustomer(updated);
    alert("Cập nhật thành công!");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Cập nhật thất bại!");
  }
};

  // Cancel edits
  const handleCancel = () => {
    setCustomer(originalCustomer);
  };

  if (loading || !customer) return <div>Đang tải...</div>;

  // Shared form fields
  const renderFormFields = () => (
    <>
      <input
        placeholder="Tên người dùng"
        className="full-width"
        value={customer.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
      />

        <input
          placeholder="Số điện thoại"
          className="full-width"
          value={customer.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

      <input
        placeholder="Email"
        className="full-width"
        value={customer.email}
        readOnly
      />

      <input
        placeholder="Địa chỉ"
        className="full-width"
        value={customer.address}
        onChange={(e) => handleChange("address", e.target.value)}
      />
    </>
  );

  return (
    <div className="profile-form">
      <h2>Thông tin cá nhân</h2>

      <div className="profile-form-show">
        {isDesktop && (
          <>
            <div className="profile-row">
              <div className="avatar">
                <img src={preview || customer.imgURL || "/default-avatar.png"} alt="" />
              </div>
              <input
                type="file"
                accept="image/*"
                id="avatarUpload"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                className="d-btn d-btn-font"
                onClick={() => document.getElementById("avatarUpload")?.click()}
              >
                <span>Tải ảnh lên</span>
              </button>
            </div>
            <div className="form-fields">{renderFormFields()}</div>
          </>
        )}
      </div>

      <div className="profile-form-show">
        {isMobile && (
          <>
            <div className="profile-row">
              <div className="profile-mobile-display">
                <div className="p-mobile-avatar">
                  <div className="avatar">
                    {customer.imgURL && <img src={customer.imgURL} alt="Avatar" />}
                  </div>
                  <button className="d-btn d-btn-font">
                    <span>Tải ảnh lên</span>
                  </button>
                </div>
                <div className="form-fields">{renderFormFields()}</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="profile-form-actions">
        <button className="d-btn d-btn-font" onClick={onChangePassword}>
          <span>Tạo mật khẩu mới</span>
        </button>
        <button className="d-btn d-btn-font" onClick={handleSave}>
          <span>Lưu</span>
        </button>
        <button className="d-btn d-btn-font" onClick={handleCancel}>
          <span>Hủy</span>
        </button>
      </div>
    </div>
  );
}