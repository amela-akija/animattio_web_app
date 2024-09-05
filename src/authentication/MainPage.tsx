import React from 'react';
import logo from '../assets/logo-web.png';
import './MainPage.css';
function MainPage(){
  return (
    <div>
      <button className="login-button">
        <text className="text-button">Sign in</text>
      </button>
      <button className="signup-button">
        <text className="text-button">Sign up</text>
      </button>
      <img src={logo} alt="logo" className="logo" />


    </div>
  )
}

export default MainPage;