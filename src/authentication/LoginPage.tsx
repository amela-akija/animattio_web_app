import React from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { TextField } from '@mui/material';

function LoginPage() {
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();
  const goToSignup = () => {
    navigate('/signup');
  };
  const goToUserAccount = () => {
    navigate('/user-account');
  };
  return (
    <div className="login-container">
      {laptop && <h1 className="login-title-laptop">Login Page</h1>}
      {mobile && <h1 className="login-title-mobile">Login Page</h1>}
      {tablet && <h1 className="login-title-tablet">Login Page</h1>}

      <div className="login-input-container">
        <TextField
          id="login"
          label="Username"
          variant="filled"
          name="login"
          className="login-input"
        />
      </div>

      <div className="login-input-container">
        <TextField
          id="password"
          label="Password"
          type="password"
          name="password"
          variant="filled"
          className="login-input"
        />
      </div>
      <div className="login-button-container">
        <button className="login-button" onClick={goToUserAccount}>
          <text className="login-text-button"> Sign in</text>
        </button>
      </div>
      <div className="login-button-container">
        <button className="registration-button" onClick={goToSignup}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <text className="login-small-text-button"> Don't have an account yet? Sign up</text>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
