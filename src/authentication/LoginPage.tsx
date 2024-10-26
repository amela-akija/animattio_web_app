import React, { useState } from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { auth, firestore } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';




function LoginPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();
  // const goToSignup = () => {
  //   navigate('/signup');
  // };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doctorCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = doctorCredentials.user;

      const idToken = await user.getIdToken();
      console.log('token', idToken);
      const doctorRef = doc(firestore, 'doctors', user.uid);
      const doctorSnapshot = await getDoc(doctorRef);

      if (doctorSnapshot.exists()) {
        const doctorData = doctorSnapshot.data();
        console.log('Doctor data:', doctorData);

        if (doctorData?.role === 'doctor') {
          const doctorUsername = doctorData.username;
          if (doctorUsername) {
            localStorage.setItem('doctorUsername', doctorUsername);
            console.log('Doctor Username:', doctorUsername);
          } else {
            console.error('Username is undefined. Check if it is stored in Firestore.');
          }

          console.log(t('doctor_login'));

          const response = await fetch('http://localhost:8080/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ uid: user.uid }),
          });

          if (response.ok) {
            navigate('/see-patients');
          } else {
            console.log('Failed to authenticate with backend');
            alert(t('backend_auth_failed'));
          }
        } else if(doctorData?.role === "admin"){
          const doctorUsername = doctorData.username;
          if (doctorUsername) {
            localStorage.setItem('doctorUsername', doctorUsername);
            console.log('Doctor Username:', doctorUsername);
          } else {
            console.error('Username is undefined. Check if it is stored in Firestore.');
          }

          console.log(t('doctor_login'));

          const response = await fetch('http://localhost:8080/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ uid: user.uid }),
          });

          if (response.ok) {
            navigate('/see-doctors');
          } else {
            console.log('Failed to authenticate with backend');
            alert(t('backend_auth_failed'));
          }
        }
        else {
          console.log('Access denied');
          await auth.signOut();
          alert(t('access_denied'));
        }
      } else {
        console.log('No document');
        alert(t('access_denied'));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


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
        {/*<button className="registration-button" onClick={goToSignup}>*/}
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          {/*<text className="login-small-text-button"> {t("message_login")}</text>*/}
        {/*</button>*/}
      </div>
    </div>
  );
}

export default LoginPage;
