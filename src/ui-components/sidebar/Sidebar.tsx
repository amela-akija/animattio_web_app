import React, { useState } from 'react';
import './Sidebar.css';
import { useLocation } from 'react-router-dom';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getMenuItems = () => {
    switch (pathname) {
      case '/':
        return (
          <>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      case '/login':
        return (
          <>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      case '/signup':
        return (
          <>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      case '/doctor-profile':
        return (
          <>
            <li>
              <a href="/logout">Log out</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      case '/user-account':
        return (
          <>
            <li>
              <a href="/logout">Log out</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      case '/add-patient':
        return (
          <>
            <li>
              <a href="/logout">Log out</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      case '/see-patients':
        return (
          <>
            <li>
              <a href="/logout">Log out</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      case '/patient-profile':
        return (
          <>
            <li>
              <a href="/logout">Log out</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
      default:
        return (
          <>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </>
        );
    }
  };

  return (
    <div className="sidebar-container">
      <button className="menu-button" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleSidebar}>
          ×
        </button>
        <ul className="sidebar-menu">{getMenuItems()}</ul>
      </div>
    </div>
  );
};

export default Sidebar;
