import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import "../../css/Login.css";
import LoginRegisterForm from "./LoginRegisterForm.tsx";
import { loginUser } from "../router/authApi.ts";

const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
    
      const response = await loginUser({
        login: formData.login,
        password: formData.password,
      });    
      if (response.isSuccess) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        console.log("Login success:", response.data);

        navigate("/"); // ✅ redirect to homepage
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LoginRegisterForm mode="login" />
      <div className="login-right-section">
        <div className="login-right-card">
          <div className="login-header">
            <h2 className="head2">Đăng nhập</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="Email / Số điện thoại"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="form-actions">
              <button type="submit" className="d-btn-font d-btn" disabled={loading}>
                {loading ? "Đang đăng nhập..." : <span>Đăng nhập</span>}
              </button>
              <Link to="/khoi-phuc-mat-khau" className="d-btn-font d-btn">
                <span>Quên mật khẩu</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;