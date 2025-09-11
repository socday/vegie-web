import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiBell, FiSearch } from 'react-icons/fi';
import logo from '../../assets/logo.png' // Ví dụ: ../assets/logo.png
import '../../css/NavBar.css';

const NavBar = () => {
    return (
        <header className="header">
            <nav className="navbar-container">
                {/* 1. Logo */}
                <div className="navbar-logo">
                    <Link to="/">
                        <img src={logo} alt="Vegie Logo" />
                    </Link>
                </div>

                {/* 2. Các liên kết chính */}
                <ul className="nav-links">
                    <li><NavLink to="/gioi-thieu">Giới Thiệu</NavLink></li>
                    <li><NavLink to="/san-pham">Sản Phẩm</NavLink></li>
                    <li><NavLink to="/blog">AI Menu</NavLink></li>
                </ul>

                <div className="nav-actions">
                    {/* 4. Thanh tìm kiếm */}
                    <form className="search-form">
                        <input type="text" placeholder="Tìm kiếm" className="search-input" />
                        <button type="submit" className="search-button">
                            <FiSearch />
                        </button>
                    </form>
                    {/* 3. Các icon chức năng */}
                    <ul className="nav-icons">
                        <li><Link to="/gio-hang"><FiShoppingCart /></Link></li>
                        <li><Link to="/thong-bao"><FiBell /></Link></li>
                        <li><Link to="/dang-nhap" title="Đăng nhập"><FiUser /></Link></li>
                    </ul>

                    
                </div>
            </nav>
        </header>
    );
};


export default NavBar;
