import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {Button } from '@mui/material';
const Sidebar = () => {
  const {t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  const toggleLanguage = () => {
    const newLanguage = language === 'pl' ? 'en' : 'pl';
    setLanguage(newLanguage);
  };
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
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/about">{t("about")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      case '/login':
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/about">{t("about")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      case '/signup':
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/about">{t("about")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      case '/doctor-profile':
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/logout">{t("log_out")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      case '/user-account':
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/logout">{t("log_out")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      case '/add-patient':
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/logout">{t("log_out")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      case '/see-patients':
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/logout">{t("log_out")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      case '/patient-profile':
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/logout">{t("log_out")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
            </li>
          </>
        );
      default:
        return (
          <>
            <Button color="inherit" onClick={toggleLanguage} className="lang-button">
              {language === 'pl' ? 'EN' : 'PL'}
            </Button>
            <li>
              <a href="/about">{t("about")}</a>
            </li>
            <li>
              <a href="/settings">{t("settings")}</a>
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
