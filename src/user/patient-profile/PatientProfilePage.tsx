import React, { forwardRef } from 'react';
import './PatientProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { Button, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TestsList from '../../ui-components/test/TestListComponent';
import MonthlyErrorGraph from './MonthlyErrorGraph';
import DailyErrorGraph from './DailyErrorGraph';
import Legend from '../../ui-components/legend/Legend';


function PatientProfilePage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const { username } = useParams<{ username: string }>();
  localStorage.setItem("patientUsername", username as string);
  const [summedErrors, setSummedErrors] = useState([]);
  useEffect(() => {
    if (username) {
      localStorage.setItem("clicked_user", username);
      console.log("clicked_user", username);
    }
  }, [username]);
  const [selectedOption, setSelectedOption] = useState('mode1');
  const [activeButton, setActiveButton] = useState<'info'  | 'stats' | 'result' >('info');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = (button: 'info' | 'stats' |'result') => {
    setActiveButton(button);
  };
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [patientUsername, setPatientUsername] = useState('');
  const [mobileId, setMobileId] = useState('');

  const legendItems = [
    { color: 'rgba(17,81,10,0.6)', label: t('Omission') },
    { color: 'rgba(230,199,50,0.9)', label: t('Commission') },
    { color: 'rgba(243,165,9,0.98)', label: t('normativeCommission') },
    { color: 'rgba(102,179,90,0.6)', label: t('normativeOmission') }
  ];


  useEffect(() => {
    if (username) {
      localStorage.setItem("clicked_user", username);
      setDocumentId(username);
      setPatientUsername(username)
      console.log("clicked_user", username);
      const fetchMobileId = async () => {
        try {
          const response = await axios.get('http://localhost:8080/patients/get-patient-id', {
            params: { username },
          });
          if (response.data) {
            const fetchedMobileId = response.data.documentId;
            console.log("Fetched mobileId from API:", fetchedMobileId);

            setMobileId(fetchedMobileId);
          } else {
            console.error('No mobile ID returned in the response');
          }
        } catch (error) {
          console.error('Error fetching patient mobile ID:', error);
        }
      };

      fetchMobileId();
    }
  }, [username]);
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const responseGender = await axios.get(`http://localhost:8080/patients/${username}/gender`);
        const responseAge = await axios.get(`http://localhost:8080/patients/${username}/age`);
        const responseType = await axios.get(`http://localhost:8080/patients/${username}/type`);
        setGender(responseGender.data);
        setAge(responseAge.data);
        setType(responseType.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };
    if (username) {
      fetchPatientData();
    }
  }, [username]);
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setter(event.target.value);
  };
  const handleSaveChanges = async () => {
    const updatedPatient = {
      patientUsername,
      gender,
      age,
      type,
    };
    try {
      console.log("documnetId",documentId);
      console.log(updatedPatient)
      await axios.put(`http://localhost:8080/patients/update-patient?documentId=${documentId}`, updatedPatient);
      setDocumentId(patientUsername);
      alert(t('patient_update_success'));
    } catch (error) {
      console.error('Error updating patient:', error);
      alert(t('patient_update_failure'));
    }
  };


  useEffect(() => {
    const fetchSummedErrors = async () => {
      if (mobileId) {
        try {
          const response = await axios.get(`http://localhost:8080/summed-errors/${mobileId}`);
          console.log("Fetched summed errors:", response.data);
          setSummedErrors(response.data);
        } catch (error) {
          console.error('Error fetching summed errors:', error);
        }
      }
    };

    fetchSummedErrors();
  }, [mobileId]);

  return (
    <div className="patient-profile-container">
      <div className="patient-profile-first-column">
        {laptop && <h1 className="patient-profile-laptop">{t('patient_profile')}:</h1>}
        {mobile && <h1 className="patient-profile-mobile">{t('patient_profile')}:</h1>}
        {tablet && <h1 className="patient-profile-tablet">{t('patient_profile')}:</h1>}
        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={() => handleButtonClick('info')}
            style={{
              backgroundColor: activeButton === 'info' ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">{t('patient_info')}:</text>
          </button>
        </div>

        <div className="patient-button-container">
          <button
            onClick={() => handleButtonClick('result')}
            className="patient-button"
            style={{
              backgroundColor: activeButton === 'result' ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">{t('results')}:</text>
          </button>
        </div>
        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={() => handleButtonClick('stats')}
            style={{
              backgroundColor: activeButton === 'stats' ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">{t('stats')}:</text>
          </button>
        </div>
        {activeButton === 'stats' && (
          <div className="stats-dropdown-container">
            <label className="label-text" style={{ color: '#2A470C', fontSize: '2vh', fontFamily: 'Karla', fontWeight: 'lighter' }}>
              {' '}
              {t('test_mode')}:
              <select
                id="testmode"
                value={selectedOption}
                onChange={handleSelectChange}
                className="stats-dropdown">
                <option value="" disabled>
                  {t('message_test')}
                </option>
                <option value="mode1">{t('mode1')}</option>
                <option value="mode2">{t('mode2')}</option>
              </select>
            </label>
          </div>
        )}
        {activeButton==='stats' && (
          <Legend items={legendItems} />
        )}
      </div>

      {/*column 2*/}
      {/**/}
      {/**/}
      <div className="patient-profile-second-column">
        <div className="big-space"></div>
        {activeButton === 'result' && <TestsList tests={summedErrors} />}
        {activeButton === 'stats' && <MonthlyErrorGraph userId={mobileId} selectedMode={selectedOption} age={Number(age)} gender={gender as 'male' | 'female'} />}
        {activeButton === 'stats' && <DailyErrorGraph userId= {mobileId} selectedMode={selectedOption} age={Number(age)} gender={gender as 'male' | 'female'}/>}

        {activeButton === 'info' && (
          <div className="patient-info-input-container">
            <div className="patient-input-wrapper">
              <label htmlFor="username" className="patient-input-label">
                {t('username')}:
              </label>
              <TextField
                id="username"
                variant="standard"
                name="username"
                value={patientUsername}
                onChange={handleInputChange(setPatientUsername)}
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="gender" className="patient-input-label">
                {t('gender')}:
              </label>
              <TextField
                id="gender"
                value={gender}
                variant="standard"
                name="gender"
                onChange={handleInputChange(setGender)}
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="type" className="patient-input-label">
                {t('type')}:
              </label>
              <TextField
                id="type"
                variant="standard"
                name="type"
                onChange={handleInputChange(setType)}
                value={type}
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            <div className="space"></div>

            <div className="patient-input-wrapper">
              <label htmlFor="age" className="patient-input-label">
                {t('age')}:
              </label>
              <TextField
                id="age"
                variant="standard"
                name="age"
                onChange={handleInputChange(setAge)}
                value={age}
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>

            <div className="button-container">
              <Button
                variant="contained"
                endIcon={<BorderColorIcon />}
                onClick={handleSaveChanges}
                style={{ color: '#2a470c', backgroundColor: '#FFFBEE' }}>
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientProfilePage;
