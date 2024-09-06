import React from 'react';
import './Navbar.css';
import logo from '../assets/logo-web-navbar.png';
import { slide as Menu } from 'react-burger-menu';
import menu from '../assets/menu-icon.png'
const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/">
        <img src={logo} alt="logo" className="navbar-logo" />
      </a>
      <Menu
        right
        customBurgerIcon={<img src={menu} alt="menu" className="navbar-menu-icon" />}
      >
        <a id="Settings" className="menu-item" href="/settings">
          Home
        </a>
        <a id="About" className="menu-item" href="/about">
          About
        </a>
      </Menu>
    </nav>
  );
};

export default Navbar;