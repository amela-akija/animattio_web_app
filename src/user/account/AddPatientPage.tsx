import React, { useState } from 'react';
import useResponsive from '../../ui-components/useResponsive';
import './AddPatientPage.css';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SaveIcon from '@mui/icons-material/Save';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function AddPatientPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const addPatientNotification = () => toast.success(t('addPatientMessage'));
  const [patientUsername, setPatientUsername] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const checkIfPatientExists = async (username: string): Promise<boolean> => {
    try {
      console.log(`Checking if patient exists: ${username}`);
      const response = await axios.get('http://localhost:8080/patients/patient-exists', {
        params: { username }
      });
      console.log(`Patient exists response: ${response.data.exists}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking patient existence:", error);
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const patientExists = await checkIfPatientExists(patientUsername);
    if (patientExists) {
      toast.error(t('errorPatientExistsMessage'));
      return;
    }

    const DoctorUsername = localStorage.getItem('doctorUsername');
    const patientData = {
      patientUsername: patientUsername,
      doctorUsername: DoctorUsername,
      gender,
      age: parseInt(age),
      type: checked ? 'epilepsy' : 'no epilepsy',
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
        addPatientNotification();
        console.log('Patient created successfully:', JSON.parse(textResponse));
      } else {
        toast.error(t('errorAddPatientMessage'));
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
          <FormControl variant="standard" fullWidth>
            <InputLabel id="gender-label">{t('gender')} </InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as string)}
              className="add-patient-select"
              disableUnderline
              displayEmpty
            >
              <MenuItem value="" disabled>
                {t('selectGender')}
              </MenuItem>
              <MenuItem value="male">{t('male')}</MenuItem>
              <MenuItem value="female">{t('female')}</MenuItem>
            </Select>
          </FormControl>
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
      <ToastContainer />
    </div>
  );
}

export default AddPatientPage;
