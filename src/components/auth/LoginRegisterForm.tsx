import { Link } from "react-router-dom";
import mascotImage from "../../assets/images/mascot-normal-mouth.png";
import "../../css/LoginRegisterForm.css" 
const LoginRegisterForm = ({ mode }: { mode: "login" | "register" }) => {
  return (
    <div className="lr-section">
      <div className={mode === "login" ? "login-card lr-card" : "register-card lr-card"}>
        <h1 className="head1">Vegie</h1>
        <div className="lr-mascot-container">
          {mode === "login" ? (
            <>
              <p className="lr-mascot-text">Bạn Chưa Có Tài Khoản?</p>
              <Link to="/dang-ky" className="d-btn d-btn-font lr-link-btn">
                <span>Đăng ký</span>
              </Link>
            </>
          ) : (
            <>
              <p className="lr-mascot-text">Bạn Đã Có Tài Khoản?</p>
              <Link to="/dang-nhap" className="d-btn d-btn-font lr-link-btn">
                <span>Đăng nhập</span>
              </Link>
            </>
          )}
          <div className="lr-logo">
            <img 
              src={mascotImage}
              alt="Mascot image"
              className="logo-c"
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterForm;