import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo-web-navbar.png';
import Sidebar from '../sidebar/Sidebar';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/">
        <img src={logo} alt="logo" className="navbar-logo" />
      </a>
      <Sidebar></Sidebar>
    </nav>
  );
};

export default Navbar;
