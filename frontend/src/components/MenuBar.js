import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import axios from 'axios';
import {toast } from 'react-toastify';

function MenuBar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin'; // Check if user is admin
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true });

      dispatch(logout());

      toast.dismiss(); // Clears all toasts before showing the logout message
      toast.success('Goodbye! You have successfully logged out.', { autoClose: 1500 });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
            {user ? `Hello, ${user.name}` : "Hello,sign in"}
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