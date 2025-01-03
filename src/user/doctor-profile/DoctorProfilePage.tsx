import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import apiClient from '../../services/apiClient';
import { t } from 'i18next';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2A470C',
    },
    secondary: {
      main: '#FFFBEE',
    },
  },
  typography: {
    fontFamily: `'Karla', sans-serif`,
  },
});

function DoctorProfilePage() {
  // Extracts the username parameter from the route
  const { username: routeUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState<string>(routeUsername || '');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || '';
    setRole(storedRole);

    if (storedRole === 'doctor') {
      const storedUsername = localStorage.getItem('doctorUsername') ?? '';
      setUsername(storedUsername);
    } else if (storedRole === 'admin' && routeUsername) {
      setUsername(routeUsername);
    }
  }, [routeUsername]);
  // Handles saving login data changes
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.put(`/doctors/update-profile?username=${username}&email=${email}&password=${password}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(t('updateSuccess'));
      localStorage.clear(); // Clears local storage to log in again
      toast.info(t('logOut'));
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('updateFail'));
    }
  };
// Handles deleting doctor
  const handleDelete = async () => {
    const confirmed = window.confirm(t('deleteWindow')); // True if the user clicks "OK" and false if the user clicks "Cancel"
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/doctors/delete-by-username?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(t('deleteSuccess'));
      navigate('/see-doctors');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(t('deleteFail'));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 8,
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
            {t('doctorProfile')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              mt: 2,
            }}
          >
            <TextField
              label={t('username')}
              variant="outlined"
              value={username}
              InputProps={{
                readOnly: true,
              }}
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
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: '#FFFBEE',
                borderRadius: '10px',
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              endIcon={<BorderColorIcon />}
              onClick={handleSaveChanges}
              sx={{
                color: '#2A470C',
                backgroundColor: '#FFFBEE',
                '&:hover': {
                  backgroundColor: '#EADAC3',
                },
              }}
            >
              {t('save')}
            </Button>
            {role === 'admin' && (
              <Button
                variant="contained"
                endIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                  color: '#2A470C',
                  backgroundColor: '#FFFBEE',
                  '&:hover': {
                    backgroundColor: '#EADAC3',
                  },
                }}
              >
                {t('delete')}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default DoctorProfilePage;
