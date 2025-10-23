import React from 'react';

// Import các icon cần thiết
import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

// Import logo của bạn
import logo from '../../assets/logo.png'; // **Đảm bảo đường dẫn này đúng**

// Import file CSS (chúng ta sẽ tạo ở bước tiếp theo)
import '../../css/Footer.css';
import { useMediaQuery } from "react-responsive";
import { useNavigate} from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isDesktop = useMediaQuery({ minWidth: 769 });
  return (
      <>
    {isDesktop &&
    <footer className="site-footer">
      {/* Phần chính màu xanh nhạt */}
      <div className="footer-main">
        <div className="footer-content">
          {/* Cột 1: Đăng ký thông tin */}
          <div className="footer-column subscribe-column">
            <h3>ĐĂNG KÝ THÔNG TIN</h3>
            <p>Đăng ký thông tin để nhận ngay </p> <p> những ưu đãi từ Vegie nhé!</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Email" className="newsletter-input" />
              <button onClick={()=> navigate("/dang-ky")} type="submit" className="newsletter-button">Đăng ký</button>
            </form>
          </div>

          {/* Cột 2: Logo */}
          <div className="footer-column logo-column">
            <img src={logo} alt="Vegie Care Logo" className="footer-logo" />
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="footer-column contact-column">
            <h3>LIÊN HỆ</h3>
            <p>Số điện thoại: 033 315 9066</p>
            <p>Email: vegicare9@gmail.com</p>
            <p>Địa chỉ: Thành phố Hồ Chí Minh</p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Zalo"><SiZalo /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh dưới cùng màu xanh đậm */}
      <div className="footer-bottom">
        <p>VEGIE CARE</p>
      </div>
    </footer>
    }
    {isMobile && <footer className="site-footer"></footer>}
    </>
  );
}