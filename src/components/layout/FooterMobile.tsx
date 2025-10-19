// FooterMobile.jsx
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './styles/FooterMobile.css';
import { FiUser, FiShoppingCart, FiBell } from 'react-icons/fi';

export default function FooterMobile() {
  return (
    <div className="footer-mobile">
      <div className="footer-mobile-display">
        {/* Logo on the left */}
        <div className="footer-mobile-logo">
          <NavLink to="/">
            <img src={logo} alt="Vegie Logo" />
          </NavLink>
        </div>

        {/* Center icons */}
        <ul className="footer-mobile-icons">
          <li>
            <NavLink to="/profile" title="Hồ sơ">
              <FiUser />
            </NavLink>
          </li>
          <li>
            <NavLink to="/thong-bao" title="Thông báo">
              <FiBell />
            </NavLink>
          </li>
          <li>
            <NavLink to="/gio-hang" title="Giỏ hàng">
              <FiShoppingCart />
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}