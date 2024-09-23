import React, { useState } from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';



function LoginPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();
  const goToSignup = () => {
    navigate('/signup');
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = (e: React.FormEvent)=>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then((userCredential)=>{console.log(userCredential);
      navigate('/user-account');
    }).catch((error)=>{console.log(error)});
    // navigate('/user-account');

  }
  return (
    <div className="login-container">
      {laptop && <h1 className="login-title-laptop">{t('login_page')}</h1>}
      {mobile && <h1 className="login-title-mobile">{t('login_page')}</h1>}
      {tablet && <h1 className="login-title-tablet">{t('login_page')}</h1>}
  <form onSubmit={signIn} className="signin-form">
      <div className="login-input-container">
        <label className="login_label"> {t('email')}:</label>
        <TextField
          id="email"
          variant="standard"
          name="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          InputProps={{
            disableUnderline: true
          }}
          className="login-input"
        />
      </div>

      <div className="login-input-container">
        <label className="login_label"> {t('password')}:</label>

        <TextField
          id="password"
          type="password"
          name="password"
          variant="standard"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}

          InputProps={{
            disableUnderline: true
          }}
          className="login-input"
        />
      </div>
      <div className="login-button-container">
        <button className="login-button" type="submit">
          <text className="login-text-button"> {t("sign_in")}</text>
        </button>
      </div>
  </form>
      <div className="login-button-container">
        <button className="registration-button" onClick={goToSignup}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <text className="login-small-text-button"> {t("message_login")}</text>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
