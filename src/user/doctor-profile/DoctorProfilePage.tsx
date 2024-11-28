import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DoctorProfilePage.css';
import { TextField, Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import apiClient from '../../services/apiClient';
import { t } from 'i18next';

function DoctorProfilePage() {
  const { username: routeUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState<string>(routeUsername || '');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || '';
    console.log('Doctor role:', storedRole);

    setRole(storedRole);

    if (storedRole === 'doctor') {
      const storedUsername = localStorage.getItem('doctorUsername') ?? '';
      setUsername(storedUsername);
      console.log('Doctor Username:', storedUsername);
    } else if (storedRole === 'admin' && routeUsername) {
      setUsername(routeUsername);
    }
  }, [routeUsername]);

  const handleSaveChanges = async () => {
    const updatedDoctor = {
      email,
      password,
    };

    try {
      const token = localStorage.getItem('token');
      await apiClient.put(`/doctors/update-profile?username=${username}&email=${email}&password=${password}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(t('updateSuccess'));

      localStorage.clear();
      toast.info(t('logOut'));
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('updateFail'));
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(t('deleteWindow'));
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
    <div className="doctor-profile-container">
      <div className="doctor-info-input-container">
        <div className="doctor-input-wrapper">
          <label htmlFor="username" className="doctor-input-label">
            {t('username')}:
          </label>
          <TextField
            id="username"
            variant="standard"
            value={username}
            InputProps={{
              readOnly: true,
              disableUnderline: true,
            }}
            className="info-input"
          />
        </div>
        <div className="space"></div>
        <div className="doctor-input-wrapper">
          <label htmlFor="email" className="doctor-input-label">
            {t('email')}:
          </label>
          <TextField
            id="email"
            variant="standard"
            value={email}
            InputProps={{
              disableUnderline: true,
            }}
            onChange={(e) => setEmail(e.target.value)}
            className="info-input"
          />
        </div>
        <div className="space"></div>
        <div className="doctor-input-wrapper">
          <label htmlFor="password" className="doctor-input-label">
            {t('password')}:
          </label>
          <TextField
            id="password"
            variant="standard"
            type="password"
            value={password}
            InputProps={{
              disableUnderline: true,
            }}
            onChange={(e) => setPassword(e.target.value)}
            className="info-input"
          />
        </div>
      </div>
      <div className="doctor-save-button-container">
        <Button
          variant="contained"
          endIcon={<BorderColorIcon />}
          onClick={handleSaveChanges}
          style={{ color: '#2a470c', backgroundColor: '#FFFBEE' }}
        >
          {t('save')}
        </Button>
        {role === 'admin' && (
          <Button
            variant="contained"
            endIcon={<DeleteIcon />}
            onClick={handleDelete}
            style={{ color: '#2a470c', backgroundColor: '#FFFBEE', marginLeft:'2%' }}
          >
            {t('delete')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default DoctorProfilePage;
