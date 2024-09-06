import React from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import '../authentication/login.css'
function LoginPage(){
  const {isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate()
  const goToSignup=()=>{
    navigate("/login");
  }
  return (
    <div>
      <h1 className="login-title">Login Page</h1>;

    </div>
  )
}
export default LoginPage;