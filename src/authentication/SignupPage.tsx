import React, { useState } from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoctor } from '../services/dbService';
import SaveIcon from '@mui/icons-material/Save';

function SignupPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error] = useState<string | null>(null);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !repeatPassword) {
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
      await addDoctor(username, 'doctor', uid);
      localStorage.setItem('doctorUsername', username);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="signup-container">
      {laptop && <h1 className="signup-title-laptop">{t('addDoctor')}</h1>}
      {mobile && <h1 className="signup-title-mobile">{t('addDoctor')}</h1>}
      {tablet && <h1 className="signup-title-tablet">{t('addDoctor')}</h1>}
      <form onSubmit={signUp} className="signup-form">
      <div className="signup-input-container">
        <label className="signup_label"> {t('username')}:</label>
        <TextField
          id="username"
          variant="standard"
          name="username"
          InputProps={{
            disableUnderline: true
          }}
          onChange={(e) => setUsername(e.target.value)}
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
          <Button
            type="submit"
            variant="contained"
            className="save-patient-button"
            style={{ backgroundColor: '#2a470c' }}
            startIcon={<SaveIcon />}
          >
            {t('add')}
          </Button>
      </div>
      </form>

    </div>
  );
}

export default SignupPage;
