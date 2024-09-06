import React from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { TextField } from '@mui/material';

function SignupPage() {
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login');
  };
  return (
    <div className="signup-container">
      {laptop && <h1 className="signup-title-laptop">Sign up</h1>}
      {mobile && <h1 className="signup-title-mobile">Sign up</h1>}
      {tablet && <h1 className="signup-title-tablet">Sign up</h1>}

      <div className="signup-input-container">
        <TextField
          id="name"
          label="Name"
          variant="filled"
          name="name"
          className="signup-input"
        />
      </div>

      <div className="signup-input-container">
        <TextField
          id="lastName"
          label="Last name"
          variant="filled"
          name="lastName"
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <TextField
          id="email"
          label="Email address"
          variant="filled"
          name="email"
          className="signup-input"
        />
      </div>

      <div className="signup-input-container">
        <TextField
          id="password"
          label="Password"
          type="password"
          name="password"
          variant="filled"
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <TextField
          id="passwordRepeat"
          label="Repeat password"
          type="password"
          name="passwordRepeat"
          variant="filled"
          className="signup-input"
        />
      </div>
      <div className="signup-button-container">

        <button className="signup-button">

          <text className="signup-text-button"> Sign up</text>

        </button>
      </div>
      <div className="signup-button-container">

        <button className="signin-button" onClick={goToLogin}>

          <text className="signup-small-text-button"> Already have an account? Sign in</text>

        </button>
      </div>
    </div>
  );
}

export default SignupPage;
