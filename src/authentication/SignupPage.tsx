import React from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { TextField } from '@mui/material';

function SignupPage() {
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();
  const goToSignup = () => {
    navigate('/login');
  };
  return (
    <div className="login-container">
      {laptop && <h1 className="login-title-laptop">Log in</h1>}
      {mobile && <h1 className="login-title-mobile">Log in</h1>}
      {tablet && <h1 className="login-title-tablet">Log in</h1>}

      <div className="input-container">
        <TextField
          id="login"
          label="Username"
          variant="filled"
          name="login"
          className="login-input"
        />
      </div>

      <div className="input-container">
        <TextField
          id="password"
          label="Password"
          type="password"
          name="password"
          variant="filled"
          className="login-input"
        />
      </div>
      <div className="button-container">

        <button className="login-button">

          <text className="text-button"> Sign in</text>

        </button>
      </div>
      <div className="button-container">

        <button className="registration-button" onClick={goToSignup}>

          <text className="small-text-button"> Don't have an account yet? Sign up</text>

        </button>
      </div>
    </div>
  );
}

export default SignupPage;
