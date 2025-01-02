import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    i18n.changeLanguage(language); // Updates the language state and localStorage when the language is toggled
    localStorage.setItem('language', language);
  }, [i18n, language]);

  const navigate = useNavigate();
  const toggleLanguage = () => {
    const newLanguage = language === 'pl' ? 'en' : 'pl'; // Toggles the application language between English and Polish
    setLanguage(newLanguage);
  };

  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggles the sidebar open or closed
  };

  const logOutNotification = () => toast.success(t('logOutMessage'));

  const logOut = async () => { // Logs out the current user by signing out from Firebase and clearing localStorage
    try {
      await signOut(auth);
      localStorage.removeItem("doctorUsername");
      localStorage.removeItem("token");
      console.log("User signed out successfully");
      logOutNotification();
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error(t('errorLogOutMessage'))
    }
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
              <a href="/about">{t('about')}</a>
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
              <a href="/about">{t('about')}</a>
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
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  logOut();
                }}>
                {t('log_out')}
              </a>
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
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  logOut();
                }}>
                {t('log_out')}
              </a>
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
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  logOut();
                }}>
                {t('log_out')}
              </a>
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
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  logOut();
                }}>
                {t('log_out')}
              </a>
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
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  logOut();
                }}>
                {t('log_out')}
              </a>
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
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  logOut();
                }}>
                {t('log_out')}
              </a>
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
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  logOut();
                }}>
                {t('log_out')}
              </a>
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
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
