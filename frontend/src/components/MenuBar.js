// src/components/MenuBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MenuBar.css'; // Optional: for styling

function MenuBar() {
  return (
    <nav className="menu-bar">
      <ul>
        <li><Link to="/">Pages</Link></li>
        {/* <li><Link to="/news">News</Link></li>
        <li><Link to="/prediction">Prediction</Link></li>
        <li><Link to="/stocks">List of Stocks</Link></li>
        <li><Link to="/portfolio">Portfolio</Link></li>
        <li className="right"><Link to="/signup">Sign Up</Link></li>
        <li className="right"><Link to="/signin">Sign In</Link></li> */}
      </ul>
    </nav>
  );
}

export default MenuBar;
