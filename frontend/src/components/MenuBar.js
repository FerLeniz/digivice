// src/components/MenuBar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';

function MenuBar({ isAdmin }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="menu-bar">
      <ul>
        {/* Left side: Pages */}
        <li><Link to="/">Pages</Link></li>

        {/* Right side: Dropdown */}
        <li className="right dropdown">
          <button onClick={toggleDropdown} className="dropdown-btn">
            Menu
          </button>
          {dropdownOpen && (
            <ul className="dropdown-content">
              {/* {isAdmin && <li><Link to="/admin">Admin</Link></li>} */}
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/signin">Sign In</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default MenuBar;
