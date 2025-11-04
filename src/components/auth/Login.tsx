import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import "../../css/Login.css";
import { useMediaQuery } from 'react-responsive';
import { loginUser, loginWithGoogle } from "../../router/authApi";
import LoginRegisterForm from "./LoginRegisterForm";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { extractErrorMessage } from "../utils/extractErrorMessage";

// Extend Window interface for Google API
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            ux_mode?: string;
          }) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config?: any) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}


const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  const navigate = useNavigate();

  const handleGoogleCallback = useCallback(async (accessToken: string) => {
    if (!accessToken) {
      setError("Không thể lấy token từ Google");
      setLoadingGoogle(false);
      return;
    }

    try {
      setLoadingGoogle(true);
      setError(null);

      // POST to backend API with accessToken
      const apiResponse = await loginWithGoogle(accessToken);
      
      if (apiResponse.isSuccess) {
        localStorage.setItem("accessToken", apiResponse.data.accessToken);
        localStorage.setItem("refreshToken", apiResponse.data.refreshToken);
        localStorage.setItem("userId", apiResponse.data.id);
        window.dispatchEvent(new Event("token-update"));
        
        if (apiResponse.data.roles.includes("ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(apiResponse.message || "Đăng nhập bằng Google thất bại");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError(extractErrorMessage(err));
    } finally {
      setLoadingGoogle(false);
    }
  }, [navigate]);

  // Load Google Identity Services
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Script already loaded, check if Google is available
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        setGoogleReady(true);
        return;
      }
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    const handleScriptLoad = () => {
      // Wait a bit for Google to be fully available
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
          clearInterval(checkGoogle);
          setGoogleReady(true);
          console.log("Google OAuth2 loaded successfully");
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
          console.error("Failed to load Google OAuth2");
        }
      }, 5000);
    };

    script.onload = handleScriptLoad;
    script.onerror = () => {
      console.error("Failed to load Google Identity Services script");
      setError("Không thể tải Google Identity Services");
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid reloading
    };
  }, []);

  const handleGoogleLogin = () => {
    // Vite uses import.meta.env instead of process.env
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === "") {
      setError("Google Client ID chưa được cấu hình. Vui lòng thêm VITE_GOOGLE_CLIENT_ID vào file .env");
      console.error("Google Client ID is missing. Please add VITE_GOOGLE_CLIENT_ID to .env file");
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      setError("Google đang tải, vui lòng thử lại sau");
      console.error("Google OAuth2 not ready yet");
      return;
    }

    setLoadingGoogle(true);
    setError(null);

    try {
      console.log("Initializing Google OAuth2 with Client ID:", clientId.substring(0, 20) + "...");
      
      // Use OAuth2 flow to get access token
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid email profile",
        callback: async (response: { access_token: string; error?: string }) => {
          if (response.error) {
            setError("Đăng nhập Google bị hủy hoặc có lỗi");
            setLoadingGoogle(false);
            return;
          }

          if (response.access_token) {
            console.log("Got Google access token:", response.access_token.substring(0, 20) + "...");
            // Call the callback with access token
            await handleGoogleCallback(response.access_token);
          } else {
            setError("Không thể lấy access token từ Google");
            setLoadingGoogle(false);
          }
        },
      });

      // Request access token (this will trigger popup)
      client.requestAccessToken();
    } catch (err: any) {
      console.error("Google login initialization error:", err);
      const errorMessage = err?.message || "Không thể khởi tạo đăng nhập Google";
      setError(errorMessage);
      setLoadingGoogle(false);
    }
  }; 

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
        emailOrPhoneNumber: formData.login,
        password: formData.password,
      });    
      if (response.isSuccess) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.id);
        window.dispatchEvent(new Event("token-update"));
        if(response.data.roles.includes("ADMIN"))
        {
          navigate("/admin");
        }else{
          navigate("/"); 
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      {isDesktop && <LoginRegisterForm mode="login" />}
      {isMobile && <h1 className="head1">Vegie</h1>}
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

          <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="show-password"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} 
              </span>
            </div>
{error && <p style={{ color: "red" }}>{error}</p>}
              
            

            <div className="form-actions">
              <button type="submit" className="d-btn-font d-btn" disabled={loading}>
                {loading ?<span>Đang đăng nhập... </span> : <span>Đăng nhập</span>}
              </button>
              {isMobile &&
              <>
               <Link to="/dang-ky" className="d-btn d-btn-font lr-link-btn">
                 <span>Đăng ký</span>
               </Link>
              </>}
              <Link to="/khoi-phuc-mat-khau" className="d-btn-font d-btn lr-link-btn">
                <span>Quên mật khẩu</span>
              </Link>
                
            </div>

            <div className="google-login-container">
              <div className="divider">
                <span>Hoặc</span>
              </div>
              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                className="google-login-btn"
                disabled={loadingGoogle || !googleReady}
              >
                {loadingGoogle ? (
                  <span>Đang đăng nhập...</span>
                ) : !googleReady ? (
                  <span>Đang tải Google...</span>
                ) : (
                  <>
                    <svg className="google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Đăng nhập bằng Google</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;