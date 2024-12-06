import React, { useState } from 'react';
import useResponsive from '../ui-components/useResponsive';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoctor } from '../services/dbService';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

function SignupPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error] = useState<string | null>(null);

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
      toast.error(t('error'));
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 6,
          mt: 20,
          backgroundColor: '#FFFBEE',
          borderRadius: '10px',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: '#2A470C',
            textShadow: '1px 1px 4px #2A350D',
            fontWeight: 'bold',
          }}
        >
          {t('addDoctor')}
        </Typography>
        <Box
          component="form"
          onSubmit={signUp}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            mt: 5,
          }}
        >
          <TextField
            label={t('username')}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: '#FFFBEE',
              borderRadius: '10px',
            }}
          />
          <TextField
            label={t('email')}
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: '#FFFBEE',
              borderRadius: '10px',
            }}
          />
          <TextField
            label={t('password')}
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: '#FFFBEE',
              borderRadius: '10px',
            }}
          />
          <TextField
            label={t('repeat_password')}
            type="password"
            variant="outlined"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: '#FFFBEE',
              borderRadius: '10px',
            }}
          />
          {error && (
            <Typography variant="body2" sx={{ color: 'red' }}>
              {error}
            </Typography>
          )}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                color: '#FFFBEE',
                backgroundColor: '#2A470C',
                '&:hover': {
                  backgroundColor: '#24530B',
                },
              }}
            >
              {t('add')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignupPage;
