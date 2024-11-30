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
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

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

  const checkIfDoctorExists = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(`/doctor-exists?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      return data.exists;
    } catch (err) {
      console.error('Error checking doctor existence:', err);
      toast.error(t('error_checking_doctor'));
      return false;
    }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !repeatPassword) {
      toast.error(t('all_fields'));
      return;
    }
    if (password !== repeatPassword) {
      toast.error(t('password_match'));
      return;
    }
    if (password.length < 8) {
      toast.error(t('password_length'));
      return;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase) {
      toast.error(t('password_capital'));
      return;
    }

    if (!hasNumber) {
      toast.error(t('password_number'));
      return;
    }

    try {
      const response = await apiClient.get(`/doctors/doctor-exists`, {
        params: { username },
      });
      if (response.data.exists) {
        toast.error(t('doctorExists'));
        return;
      }
    } catch (error) {
      console.error('Error checking doctor existence:', error);
      toast.error(t('error_checking_doctor_existence'));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await addDoctor(username, 'doctor', uid);
      toast.success(t('addDoctorSuccess'));
      navigate('/see-doctors');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(t('error'));
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
            // className="signuo-patient-button"
            style={{ backgroundColor: '#2a470c', width:"24%" }}
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
