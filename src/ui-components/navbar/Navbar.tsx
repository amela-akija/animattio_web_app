import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo-web-navbar.png';
import { slide as Menu } from 'react-burger-menu';
import menu from '../../assets/menu-icon.png'
import useResponsive from '../useResponsive';

const Navbar = () => {
  const {isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  let customIcon;
  if (mobile) {
    customIcon = <img src={menu} alt="Mobile Menu" className="navbar-menu-icon-mobile" />;
  } else if (tablet) {
    customIcon = <img src={menu} alt="Tablet Menu" className="navbar-menu-icon-tablet" />;
  } else if (laptop) {
    customIcon = <img src={menu} alt="Laptop Menu" className="navbar-menu-icon-laptop" />;
  }
  return (
    <nav className="navbar">
      <a href="/public">
        <img src={logo} alt="logo" className="navbar-logo" />
      </a>
      <Menu
        right
        customBurgerIcon={customIcon}
      >
        <a id="Settings" className="menu-item" href="/settings">
          Settings
        </a>
        <a id="About" className="menu-item" href="/about">
          About
        </a>
      </Menu>
    </nav>
  );
};

export default Navbar;