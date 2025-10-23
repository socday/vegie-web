import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import "../../css/Register.css";
import "../../index.css";
import LoginRegisterForm from "./LoginRegisterForm";
import { registerUser } from "../../router/authApi";
import { useMediaQuery } from "react-responsive";
import StageNotification from "../notifications/StageNotification";
import StageNotificationWrapper from "../notifications/StageNotificationWrapper";
import { useNavigate } from "react-router-dom";


const Register = () => { 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
    passwordConfirm: "",
    coupon: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const phonePattern = /^(0)(\d{9})$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validate phone number while typing
    if (name === "phoneNumber") {
      const cleanValue = value.replace(/[^\d+]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));

      if (cleanValue && !phonePattern.test(cleanValue)) {
        setError("Số điện thoại không hợp lệ (bắt đầu bằng 0, gồm 10 số)");
      } else {
        setError(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submit
    if (!phonePattern.test(formData.phoneNumber)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Mật khẩu không khớp");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await registerUser({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        email: formData.email,
        password: formData.password,
        coupon: formData.coupon,
      });

      if (res.isSuccess === false) {
        setError(res.message || "Đăng ký thất bại");
      } else if (res.isSuccess === true) {
        setSuccess(true);
        console.log("Đăng ký thành công:", res);
        navigate("/noti/register-success");
        }
        else {
          setError("Đăng ký thất bại liên hệ quản trị viên");
        }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });
  return (
    <div className="register-page">
      {isMobile && <h1 className="head1">Vegie</h1>}
      <div className="register-left-section">
        <div className="register-left-card">
          <h2 className="head2">Đăng ký</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <div className="form-group__item">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Họ, tên"
                  required
                  className="inputName"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  required
                  className="inputPhonenumber"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Địa chỉ"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu"
                required
              />
            </div>

            <div className="form-group">
              <div className="coupon-form-group">
                <span className="r-coupon-text">
                  <p className="r-coupon-text-visible">Mã</p>
                </span>
                <input
                  type="text"
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleChange}
                  placeholder="Nhập mã"
                  className="inputCoupon"
                />
              </div>
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">Đăng ký thành công!</p>}
            <div className="form-actions">
            <button type="submit" className="d-btn d-btn-font" disabled={loading}>
              <span>{loading ? "Đang xử lý..." : "Tiếp tục"}</span>
            </button>
            {isMobile && <>
              <Link to="/dang-nhap" className="d-btn d-btn-font lr-link-btn">
                <span>Đăng nhập</span>
              </Link>
            </>}
            </div>
          </form>
        </div>
      </div>

      {isDesktop && <LoginRegisterForm mode="register" />}
    </div>
  );
};

export default Register;