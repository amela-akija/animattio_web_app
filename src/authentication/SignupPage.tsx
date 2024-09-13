import React from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function SignupPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login');
  };
  return (
    <div className="signup-container">
      {laptop && <h1 className="signup-title-laptop">{t('signup_page')}</h1>}
      {mobile && <h1 className="signup-title-mobile">{t('signup_page')}</h1>}
      {tablet && <h1 className="signup-title-tablet">{t('signup_page')}</h1>}

      <div className="signup-input-container">
        <label className="signup_label"> {t('name')}</label>
        <TextField
          id="name"
          variant="standard"
          name="name"
          InputProps={{
            disableUnderline: true
          }}
          className="signup-input"
        />
      </div>

      <div className="signup-input-container">
        <label className="signup_label"> {t('last_name')}</label>
        <TextField
          id="lastName"
          variant="standard"
          name="lastName"
          InputProps={{
            disableUnderline: true
          }}
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <label className="signup_label"> {t('pwz')}</label>
        <TextField
          id="pwz"
          variant="standard"
          name="pwz"
          InputProps={{
            disableUnderline: true
          }}
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <label className="signup_label"> {t('email')}</label>
        <TextField
          id="email"
          variant="standard"
          name="email"
          InputProps={{
            disableUnderline: true
          }}
          className="signup-input"
        />
      </div>

      <div className="signup-input-container">
        <label className="signup_label"> {t('password')}</label>
        <TextField
          id="password"
          type="password"
          name="password"
          variant="standard"
          InputProps={{
            disableUnderline: true
          }}
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <label className="signup_label"> {t('repeat_password')}</label>
        <TextField
          id="passwordRepeat"
          type="password"
          name="passwordRepeat"
          variant="standard"
          InputProps={{
            disableUnderline: true
          }}
          className="signup-input"
        />
      </div>
      <div className="signup-button-container">
        <button className="signup-button" onClick={goToLogin}>
          <text className="signup-text-button">{t("sign_up")}</text>
        </button>
      </div>
      <div className="signup-button-container">
        <button className="signin-button" onClick={goToLogin}>
          <text className="signup-small-text-button">{t("message_signup")}</text>
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
