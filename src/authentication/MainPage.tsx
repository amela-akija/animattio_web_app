import React from 'react';
import logo from '../assets/logo-web.png';
import './MainPage.css';
import useResponsive from '../ui-components/useResponsive';

function MainPage() {
  const {isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  return (
    <div>
      {laptop && <button className="login-button">
        <text className="text-button">Sign in</text>
      </button>
      }
      {laptop && <button className="signup-button">
        <text className="text-button">Sign up</text>
      </button>
      }
      {laptop && <img src={logo} alt="logo" className="logo" />}


      {mobile && <button className="login-button">
        <text className="text-button">Sign in</text>
      </button>
      }
      {mobile && <button className="signup-button">
        <text className="text-button">Sign up</text>
      </button>
      }
      {mobile && <img src={logo} alt="logo" className="logo" />}

      {tablet && <button className="login-button">
        <text className="text-button">Sign in</text>
      </button>
      }
      {tablet && <button className="signup-button">
        <text className="text-button">Sign up</text>
      </button>
      }
      {tablet && <img src={logo} alt="logo" className="logo" />}


    </div>
  );
}

export default MainPage;