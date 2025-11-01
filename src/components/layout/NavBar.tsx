import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiBell, FiMenu, FiSearch } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import './styles/NavBar.css';
import { useMediaQuery } from 'react-responsive';

const NavBar = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const isLogin = localStorage.getItem("accessToken");

    // Highlight search matches in the current page
    useEffect(() => {
        // Remove previous highlights
        const oldMarks = document.querySelectorAll('mark.page-search-highlight');
        oldMarks.forEach(mark => {
            const parent = mark.parentNode!;
            parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
            parent.normalize(); // merge text nodes
        });

        if (!searchTerm.trim()) return;

        const regex = new RegExp(searchTerm, 'gi');
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodesToReplace: Text[] = [];

        while (walker.nextNode()) {
            const node = walker.currentNode as Text;
            if (regex.test(node.nodeValue || '')) {
                nodesToReplace.push(node);
            }
        }

        nodesToReplace.forEach(node => {
            const frag = document.createDocumentFragment();
            const parts = node.nodeValue!.split(regex);

            parts.forEach((part, i) => {
                frag.appendChild(document.createTextNode(part));
                if (i < parts.length - 1) {
                    const mark = document.createElement('mark');
                    mark.className = 'page-search-highlight';
                    mark.textContent = searchTerm;
                    frag.appendChild(mark);
                }
            });

            node.parentNode?.replaceChild(frag, node);
        });
    }, [searchTerm]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You could scroll to first match or show message here if you want
    };

    return (
        <header className="header">
            <nav className="navbar-container">
                {/* 1. Logo */}
                <div className="navbar-logo">
                    <NavLink to="/">
                        <img src={logo} alt="Vegie Logo" />
                    </NavLink>
                </div>

                {/* 2. Links + search */}
                {isDesktop && (
                    <>
                        <ul className="nav-links">
                            <li><NavLink to="/gioi-thieu">Giới Thiệu</NavLink></li>
                            <li><NavLink to="/san-pham">Sản Phẩm</NavLink></li>
                            <li><NavLink to="/ai-menu">AI Menu</NavLink></li>
                        </ul>

                        <div className="nav-actions">
                            {/* Search Bar */}
                            {/* <form className="search-form" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm trong trang..."
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <button type="submit" className="search-button">
                                    <FiSearch />
                                </button>
                            </form> */}

                            {/* Icons */}
                            <div className="nav-icons-action">
                                <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                                    <FiMenu />
                                </button>
                                <ul className={`nav-icons ${isOpen ? 'open' : ''}`}>
                                    <li>
                                    <NavLink
                                        to={isLogin ? "/profile" : "/dang-nhap"}
                                        title={isLogin ? "Hồ sơ" : "Đăng nhập"}
                                    >
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
                            <form className="search-form" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm" 
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
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