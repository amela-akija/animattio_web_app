import React from 'react';
import logo from '../assets/logo-web.png';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import useResponsive from '../ui-components/useResponsive';
import { useTranslation } from "react-i18next";

function MainPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login');
  };
  const goToSignup = () => {
    navigate('/signup');
  };
  return (
    <div>
      {laptop && (
        <button onClick={() => goToLogin()} className="main-login-button-laptop">
          <text className="main-text-button">{t('sign_in')}</text>
        </button>
      )}
      {laptop && (
        <button onClick={() => goToSignup()} className="main-signup-button-laptop">
          <text className="main-text-button">{t('sign_up')}</text>
        </button>
      )}
      {laptop && <img src={logo} alt="logo" className="logo-laptop" />}

      {mobile && (
        <button onClick={() => goToLogin()} className="main-login-button-mobile">
          <text className="main-text-button">{t('sign_in')}</text>
        </button>
      )}
      {mobile && (
        <button onClick={() => goToSignup()} className="main-signup-button-mobile">
          <text className="main-text-button">{t('sign_up')}</text>
        </button>
      )}
      {mobile && <img src={logo} alt="logo" className="logo-mobile" />}

      {tablet && (
        <button onClick={() => goToLogin()} className="main-login-button-tablet">
          <text className="main-text-button">{t('sign_in')}</text>
        </button>
      )}
      {tablet && (
        <button onClick={() => goToSignup()} className="main-signup-button-tablet">
          <text className="main-text-button">{t('sign_up')}</text>
        </button>
      )}
      {tablet && <img src={logo} alt="logo" className="logo-tablet" />}
    </div>
  );
}

export default MainPage;
