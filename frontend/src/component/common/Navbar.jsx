import React, {useState} from "react";
import '../../style/navbar.css';
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
);

const CategoryIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
    </svg>
);

const AccountIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
);

const AdminIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/>
    </svg>
);

const LoginIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
    </svg>
);

const CartIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.2 6H21l-1.68 8.39c-.16.79-.84 1.36-1.65 1.61H8.1a2 2 0 0 1-1.96-1.62L4.96 5H3V3H5l.2 3zM5.6 8l1.14 6h10.5l1.4-6H5.6z"/>
    </svg>
);

const Navbar = () => {
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const isAdmin = ApiService.isAdmin();
    const isAuthenticated = ApiService.isAuthenticated();

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        navigate(`/?search=${searchValue}`);
    };

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout? ");
        if (confirm) {
            ApiService.logout();
            setTimeout(() => {
                navigate('/login');
            }, 500);
        }
    };

    return (
        <nav className="navbar">
            {/* TOP ROW: Logo + Search */}
            <div className="navbar-top">
                <div className="navbar-brand">
                    <NavLink to="/"><img src="./phegon_mart.png" alt="Phegon Mart" /></NavLink>
                </div>

                <form className="navbar-search" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="商品を検索 / Search products"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    <button type="submit">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        Search
                    </button>
                </form>

                <div className="navbar-top-actions">
                    <NavLink to="/cart" className="top-action-link">
                        <CartIcon />
                        <span>Cart</span>
                    </NavLink>
                    {isAuthenticated && (
                        <NavLink to="/profile" className="top-action-link">
                            <AccountIcon />
                            <span>My Account</span>
                        </NavLink>
                    )}
                    {!isAuthenticated && (
                        <NavLink to="/login" className="top-action-link">
                            <LoginIcon />
                            <span>Login</span>
                        </NavLink>
                    )}
                </div>
            </div>

            {/* BOTTOM ROW: Nav links with icons */}
            <div className="navbar-bottom">
                <div className="navbar-links">
                    <NavLink to="/" className="nav-item">
                        <HomeIcon />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/categories" className="nav-item">
                        <CategoryIcon />
                        <span>Categories</span>
                    </NavLink>
                    {isAdmin && (
                        <NavLink to="/admin" className="nav-item">
                            <AdminIcon />
                            <span>Admin</span>
                        </NavLink>
                    )}
                    {isAuthenticated && (
                        <NavLink onClick={handleLogout} className="nav-item logout-item">
                            <LogoutIcon />
                            <span>Logout</span>
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
