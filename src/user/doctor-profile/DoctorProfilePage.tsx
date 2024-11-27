import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DoctorProfilePage.css';
import { TextField, Button } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { toast } from 'react-toastify';
import apiClient from '../../services/apiClient';

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
      const response = await apiClient.put(`/doctors/update-profile?username=${username}&email=${email}&password=${password}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('updateSuccess');

      localStorage.clear();
      toast.info('logOut');
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('updateFail');
    }
  };



  return (
    <div className="doctor-profile-container">
      <div className="doctor-info-input-container">
        <div className="doctor-input-wrapper">
          <label htmlFor="username" className="doctor-input-label">
            Username:
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
            Email:
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
            Password:
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
          Save
        </Button>
      </div>
    </div>
  );
}

export default DoctorProfilePage;
