import React, { useState } from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoctor } from '../services/dbService';

function SignupPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pwz, setPwz] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lastName || !pwz || !email || !password || !repeatPassword) {
      alert(t('all_fields'));
      return;
    }
    if (password !== repeatPassword) {
      alert(t('password_match'));
      return;
    }
    if (password.length < 8) {
      alert(t('password_length'));
      return;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase) {
      alert(t('password_capital'));
      return;
    }

    if (!hasNumber) {
      alert(t('password_number'));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      const uid = userCredential.user.uid;
      await addDoctor(name, lastName, 'doctor',pwz, email, uid);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="signup-container">
      {laptop && <h1 className="signup-title-laptop">{t('signup_page')}</h1>}
      {mobile && <h1 className="signup-title-mobile">{t('signup_page')}</h1>}
      {tablet && <h1 className="signup-title-tablet">{t('signup_page')}</h1>}
      <form onSubmit={signUp} className="signup-form">
      <div className="signup-input-container">
        <label className="signup_label"> {t('name')}:</label>
        <TextField
          id="name"
          variant="standard"
          name="name"
          InputProps={{
            disableUnderline: true
          }}
          onChange={(e) => setName(e.target.value)}
          className="signup-input"
        />
      </div>

      <div className="signup-input-container">
        <label className="signup_label"> {t('last_name')}:</label>
        <TextField
          id="lastName"
          variant="standard"
          name="lastName"
          InputProps={{
            disableUnderline: true
          }}
          onChange={(e) => setLastName(e.target.value)}
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <label className="signup_label"> {t('pwz')}:</label>
        <TextField
          id="pwz"
          variant="standard"
          name="pwz"
          InputProps={{
            disableUnderline: true
          }}
          onChange={(e) => setPwz(e.target.value)}
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <label className="signup_label"> {t('email')}:</label>
        <TextField
          id="email"
          variant="standard"
          name="email"
          InputProps={{
            disableUnderline: true
          }}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />
      </div>

      <div className="signup-input-container">
        <label className="signup_label"> {t('password')}:</label>
        <TextField
          id="password"
          type="password"
          name="password"
          variant="standard"
          InputProps={{
            disableUnderline: true
          }}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />
      </div>
      <div className="signup-input-container">
        <label className="signup_label"> {t('repeat_password')}:</label>
        <TextField
          id="passwordRepeat"
          type="password"
          name="passwordRepeat"
          variant="standard"
          InputProps={{
            disableUnderline: true
          }}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className="signup-input"
        />
      </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="signup-button-container">
        <button className="signup-button">
          <text className="signup-text-button">{t("sign_up")}</text>
        </button>
      </div>
      </form>
      <div className="signup-button-container">
        <button className="signin-button" onClick={goToLogin}>
          <text className="signup-small-text-button">{t("message_signup")}</text>
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
