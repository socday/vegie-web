import React from 'react';

// Import các icon cần thiết
import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { MdMail } from 'react-icons/md';
import { FaPhone } from 'react-icons/fa';

// Import logo của bạn
import logo from '../../assets/logo.png'; // **Đảm bảo đường dẫn này đúng**

// Import file CSS (chúng ta sẽ tạo ở bước tiếp theo)
import './styles/Footer.css';
import { useMediaQuery } from "react-responsive";
import { useNavigate} from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isDesktop = useMediaQuery({ minWidth: 769 });
  return (
      <>
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
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61577740254103" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Zalo"><SiZalo /></a>
              <a href="#" aria-label="Email"><MdMail /></a>
              <a href="#" aria-label="Phone"><FaPhone /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh dưới cùng màu xanh đậm */}
      <div className="footer-bottom">
        <p>VEGIE CARE</p>
      </div>
    </footer>
    </>
  );
}