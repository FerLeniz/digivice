import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

function MenuBar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin'; // Check if user is admin

  const handleLogout = () => {
    dispatch(logout());
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="menu-bar">
      <ul>
        <li><Link to="/">Pages</Link></li>
        <li><Link to="/like">Favorites</Link></li>
        <li className="right dropdown">
          <button onClick={toggleDropdown} className="dropdown-btn">
            {user? `Hello, ${user.name}` : "Hello,sign in"}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-content">
              {isAdmin && <li><Link to="/admin">Admin</Link></li>}
              {isAuthenticated ? (
                <>
                  <li><Link onClick={handleLogout} >Logout</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/signup">Sign Up</Link></li>
                  <li><Link to="/signin">Sign In</Link></li>
                </>
              )}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default MenuBar;