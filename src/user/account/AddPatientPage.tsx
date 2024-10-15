import React, { useState } from 'react';
import useResponsive from '../../ui-components/useResponsive';
import './AddPatientPage.css';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
    console.log("dr",DoctorUsername);
    const patientData = {
      patientUsername: patientUsername,
      doctorUsername: DoctorUsername,
      gender,
      age: parseInt(age),
      type: checked ? 'epilepsy' : 'normal',
    };

    try {
      const response = await fetch('http://localhost:8080/patients/create-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(patientData),
      });

      const textResponse = await response.text();
      console.log('Raw server response:', textResponse);

      if (response.ok) {
        const result = JSON.parse(textResponse);
        console.log('Patient created successfully:', result);
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
        <div className="add-patient-first-column">
          {laptop && <h1 className="add-patient-laptop">{t('add_patient')}</h1>}
          {mobile && <h1 className="add-patient-mobile">{t('add_patient')}</h1>}
          {tablet && <h1 className="add-patient-tablet">{t('add_patient')}</h1>}

          <div className="add-patient-input-container">
            <label className="add_label">{t('username')}:</label>
            <TextField
              id="username"
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
              name="username"
              className="add-patient-input"
              value={patientUsername}
              onChange={(e) => setPatientUsername(e.target.value)}
            />
          </div>
        </div>

        <div className="add-patient-second-column">
          {laptop && <h1 className="add-patient-dot-laptop">add patient</h1>}

          <div className="add-patient-input-container">
            <label className="add_label">{t('gender')}:</label>
            <TextField
              id="gender"
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
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
              InputProps={{
                disableUnderline: true,
              }}
              name="age"
              className="add-patient-input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          {laptop && (
            <div className="save-button-container">
              <button type="submit" className="save-patient-button">
                <span className="save-text-button">Add</span>
              </button>
            </div>
          )}
        </div>

        <div className="add-patient-third-column">
          {laptop && <h1 className="add-patient-dot-laptop">add patient</h1>}
          <label className="checkbox">
            <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
            {t('epilepsy')}
          </label>
          {mobile && (
            <div className="save-button-container">
              <button type="submit" className="save-patient-button">
                <span className="save-text-button">Add</span>
              </button>
            </div>
          )}
          {tablet && (
            <div className="save-button-container">
              <button type="submit" className="save-patient-button">
                <span className="save-text-button">Add</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddPatientPage;
