import React, { useState } from 'react';
import useResponsive from '../../ui-components/useResponsive';
import './AddPatientPage.css';
import { TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SaveIcon from '@mui/icons-material/Save';

function AddPatientPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();

  const [patientUsername, setPatientUsername] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const DoctorUsername = localStorage.getItem('doctorUsername');
    const patientData = {
      patientUsername: patientUsername,
      doctorUsername: DoctorUsername,
      gender,
      age: parseInt(age),
      type: checked ? 'epilepsy' : 'normal'
    };

    try {
      const response = await fetch('http://localhost:8080/patients/create-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(patientData)
      });

      const textResponse = await response.text();

      if (response.ok) {
        console.log('Patient created successfully:', JSON.parse(textResponse));
      } else {
        console.error('Error creating patient:', response.statusText);
        console.error('Server response:', textResponse);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  return (
    <div className="add-patient-container">
      <form onSubmit={handleSubmit}>
        {laptop && <h1 className="add-patient-laptop">{t('add_patient')}</h1>}
        {mobile && <h1 className="add-patient-mobile">{t('add_patient')}</h1>}
        {tablet && <h1 className="add-patient-tablet">{t('add_patient')}</h1>}

        <div className="add-patient-input-container">
          <label className="add_label">{t('username')}:</label>
          <TextField
            id="username"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            name="username"
            className="add-patient-input"
            value={patientUsername}
            onChange={(e) => setPatientUsername(e.target.value)}
          />
        </div>

        <div className="add-patient-input-container">
          <label className="add_label">{t('gender')}:</label>
          <TextField
            id="gender"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            name="gender"
            className="add-patient-input"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        <div className="add-patient-input-container">
          <label className="add_label">{t('age')}:</label>
          <TextField
            id="age"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            name="age"
            className="add-patient-input"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <label className="checkbox">
          <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
          {t('epilepsy')}
        </label>

        <div className="save-button-container">
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

export default AddPatientPage;
