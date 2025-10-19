import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiBell, FiMenu, FiSearch } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import './styles/NavBar.css';
import { useMediaQuery } from 'react-responsive';

const NavBar = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="header">
            <nav className="navbar-container">
                {/* 1. Logo */}
                <div className="navbar-logo">
                    <NavLink to="/">
                        <img src={logo} alt="Vegie Logo" />
                    </NavLink>
                </div>

                {/* 2. Các liên kết chính */}
                {isDesktop && (
                <>
                <ul className="nav-links">
                    <li><NavLink to="/gioi-thieu">Giới Thiệu</NavLink></li>
                    <li><NavLink to="/san-pham">Sản Phẩm</NavLink></li>
                    <li><NavLink to="/ai-menu">AI Menu</NavLink></li>
                </ul>

                <div className="nav-actions">
                    {/* 3. Thanh tìm kiếm */}
                    <form className="search-form">
                        <input type="text" placeholder="Tìm kiếm" className="search-input" />
                        <button type="submit" className="search-button">
                            <FiSearch />
                        </button>
                    </form>

                    {/* 4. Toggle button for dropdown */}
                    <div className="nav-icons-action">
                        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                            <FiMenu />
                        </button>

                        {/* 5. Dropdown icons */}
                        <ul className={`nav-icons ${isOpen ? "open" : ""}`}>
                            <li>
                                <NavLink to="/profile" title="Hồ sơ">
                                <FiUser />
                                </NavLink>
                            </li>
                                <li><NavLink to="/gio-hang"><FiShoppingCart /></NavLink></li>
                            <li><NavLink to="/thong-bao"><FiBell /></NavLink></li>
                        </ul>
                    </div>
                </div>
                </>
                )}
                 {isMobile && (
                <>
                <div className="nav-actions">
                    {/* 3. Thanh tìm kiếm */}
                    <form className="search-form">
                        <input type="text" placeholder="Tìm kiếm" className="search-input" />
                        <button type="submit" className="search-button">
                            <FiSearch />
                        </button>
                    </form>
                </div>
                <ul className="nav-links">
                    <li><NavLink to="/san-pham">Vegie Box</NavLink></li>
                    <li><NavLink to="/ai-menu">AI Menu</NavLink></li>
                </ul>

                </>
                )}
            </nav>
        </header>
    );
};

export default NavBar;