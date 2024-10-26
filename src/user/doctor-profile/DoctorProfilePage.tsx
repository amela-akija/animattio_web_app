import React, { useEffect, useState } from 'react';
import './DoctorProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import BorderColorIcon from '@mui/icons-material/BorderColor';

interface Doctor {
  username: string;
  email: string;
}

function DoctorProfilePage() {
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const { t } = useTranslation();

  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [editedData, setEditedData] = useState<Doctor | null>(null);
  const [changeCredentials, setChangeCredentials] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const fetchDoctorData = async () => {
      const uid = localStorage.getItem('id');
      if (uid) {
        const db = getFirestore();
        const doctorDoc = await getDoc(doc(db, 'doctors', uid));
        if (doctorDoc.exists()) {
          const doctor = doctorDoc.data() as Doctor;
          setDoctorData(doctor);
          setEditedData(doctor);
        }
      }
    };
    fetchDoctorData();
  }, []);

  const onSave = async () => {
    const uid = localStorage.getItem('id');
    if (uid && editedData) {
      const db = getFirestore();
      const dr = doc(db, 'doctors', uid);

      try {
        const updatedData = { ...editedData };
        await updateDoc(dr, updatedData);
        setDoctorData(editedData);
        alert(t('data_update'));
      } catch (error) {
        console.error('Error while updating: ', error);
      }
    }
  };

  const handleChangeWindow = () => {
    setChangeCredentials(true);
  };

  const handleCloseChanges = () => {
    setChangeCredentials(false);
  };

  const handleEditChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedData) {
      setEditedData({
        ...editedData,
        [name]: value,
      });
    }
  };

  const handleUsernameUpdate = async () => {
    const uid = localStorage.getItem('id');
    if (uid && editedData) {
      const newUsername = editedData.username;

      try {
        const response = await fetch(`/update-username/${doctorData?.username}/${newUsername}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert(t('username_update_success'));
          setDoctorData(prev => prev ? { ...prev, username: newUsername } : null);
        } else {
          const errorMessage = await response.text();
          alert(`Error: ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error while updating username: ', error);
      }
    }
  };

  return (
    <div className="doctor-profile-container">
      <div className="doctor-profile-first-column">
        <h1 className={mobile ? "doctor-profile-mobile" : laptop ? "doctor-profile-laptop" : "doctor-profile-tablet"}>
          {t('doctor_profile')}:
        </h1>
      </div>
      <div className="doctor-profile-second-column">
        <div className="dr-button-container">
          <text className="dr-text">
            {t('message_changes')} <strong> {t('save')}</strong>.<br />
            {t('message_credential')} <strong> {t('change')}</strong>
          </text>
        </div>

        <div className="doctor-input-wrapper">
          <label htmlFor="username" className="doctor-input-label">
            {t('username')}:
          </label>
          <TextField
            id="username"
            value={editedData?.username || ''}
            variant="standard"
            name="username"
            onChange={handleEditChanges}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </div>

        {changeCredentials && (
          <div className="credentials-container">
            <h2 className="dr-text">{t('change')}</h2>
            <div className="space"></div>
            <div className="input-wrapper2">
              <label htmlFor="email" className="input-label2">
                {t('email')}:
              </label>
              <TextField
                id="email"
                variant="standard"
                name="email"
                className="info-input2"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </div>
            <div className="space"></div>
            <div className="input-wrapper2">
              <label htmlFor="password" className="input-label2">
                {t('password')}:
              </label>
              <TextField
                id="password"
                variant="standard"
                type="password"
                name="password"
                className="info-input2"
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </div>
            <br />
            <button onClick={handleCloseChanges} className="window-button">
              {t('close')}
            </button>
            <button onClick={handleCloseChanges} className="window-button">
              {t('save')}
            </button>
          </div>
        )}

        <div className="info-button-container">
          <Button
            variant="contained"
            endIcon={<BorderColorIcon />}
            onClick={onSave}
            style={{ backgroundColor: '#2a470c' }}>
            {t('save')}
          </Button>
          <Button
            variant="contained"
            endIcon={<BorderColorIcon />}
            onClick={handleUsernameUpdate}
            style={{ backgroundColor: '#2a470c' }}>
            {t('change')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfilePage;
