import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { auth, firestore } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2A470C',
    },
    secondary: {
      main: '#FBE3BE',
    },
  },
  typography: {
    fontFamily: `'Karla', sans-serif`,
  },
});

function LoginPage() {
  const { t } = useTranslation(); // Translation hook for internationalization
  const navigate = useNavigate(); // React Router hook for navigation
  // Variables to store email and password input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function for sign in
  const signIn = async (e: React.FormEvent) => {
    // e is a form event triggered in a React application, in this case by submitting a form
    e.preventDefault(); // ensures that the page doesn't reload or navigate away
    try {
      const doctorCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = doctorCredentials.user;

      // Firebase ID token for the signed-in user
      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);

      // Firestore document for the signed-in user
      const doctorRef = doc(firestore, 'doctors', user.uid);
      const doctorSnapshot = await getDoc(doctorRef);

      if (doctorSnapshot.exists()) {
        const doctorData = doctorSnapshot.data();
        localStorage.setItem('role', doctorData.role);
        // Navigation based on role
        if (doctorData?.role === 'doctor') {
          localStorage.setItem('doctorUsername', doctorData.username || '');
          navigate('/see-patients');
        } else if (doctorData?.role === 'admin') {
          localStorage.setItem('doctorUsername', doctorData.username || '');
          navigate('/see-doctors');
        } else {
          // Sign out if role is invalid
          await auth.signOut();
          toast.error(t('access_denied'));
        }
      } else {
        toast.error(t('access_denied')); // No document
      }
    } catch (error) {
      toast.error(t('errorLogin')); // Authentication error
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 20,
            backgroundColor: '#FBE3BE',
            borderRadius: '10px',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: '#2A470C', textShadow: '1px 1px 4px #2A350D' }}
          >
            {t('login_page')}
          </Typography>
          <Box component="form" onSubmit={signIn} noValidate  sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            mt: 5,
          }}>
            <TextField
              fullWidth
              label={t('email')}
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: {
                  backgroundColor: '#FBE3BE',
                  borderRadius: '10px',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#2A470C' },
                  '&:hover fieldset': { borderColor: '#2A350D' },
                },
              }}
            />
            <TextField
              fullWidth
              label={t('password')}
              variant="outlined"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: {
                  backgroundColor: '#FBE3BE',
                  borderRadius: '10px',
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#2A470C' },
                  '&:hover fieldset': { borderColor: '#2A350D' },
                },
              }}
            />
            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                sx={{
                  width: '50%',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontFamily: 'Karla, sans-serif',
                  fontSize: '1rem',
                }}
              >
                {t('sign_in')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
