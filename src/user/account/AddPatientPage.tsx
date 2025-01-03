import React, { useState } from 'react';
import useResponsive from '../../ui-components/useResponsive';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Box,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SaveIcon from '@mui/icons-material/Save';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import apiClient from '../../services/apiClient';

function AddPatientPage() {
  const { t } = useTranslation();
  const addPatientNotification = () => toast.success(t('addPatientMessage'));
  // State variables for form inputs
  const [patientUsername, setPatientUsername] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);

  // Handle changes to the epilepsy checkbox
  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const checkIfPatientExists = async (username: string): Promise<boolean> => { // Checks if a patient with the given username already exists
    try {
      const response = await axios.get('https://backend-animattio-59a791d90bc1.herokuapp.com/patients/patient-exists', {
        params: { username },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.exists;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          toast.error(t('errorUnauthorizedMessage'));
        }
      } else {
        console.error("Unexpected error:", error);
      }
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { // Handles form submission for adding a new patient
    event.preventDefault();
    // Validation
    if (!patientUsername || !gender || !age) {
      toast.error(t('errorRequiredFieldsMessage'));
      return;
    }
    // Checks if the patient already exists
    const patientExists = await checkIfPatientExists(patientUsername);
    if (patientExists) {
      toast.error(t('errorPatientExistsMessage'));
      return;
    }

    const DoctorUsername = localStorage.getItem('doctorUsername');
    // Patient data for submission
    const patientData = {
      patientUsername,
      doctorUsername: DoctorUsername,
      gender,
      age: parseInt(age),
      type: checked ? 'epilepsy' : 'no epilepsy',
    };

    try {
      // Sends the patient data to the backend
      const response = await apiClient.post('/patients/create-patient', patientData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Clears inputs after successful response
      if (response.status >= 200 && response.status < 300) {
        addPatientNotification();
        setPatientUsername('');
        setGender('');
        setAge('');
        setChecked(false);
      } else {
        toast.error(t('errorAddPatientMessage'));
      }
    } catch (error) {
      toast.error(t('errorAddPatientMessage'));
    }
  };

  return (
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
          sx={{ color: '#2A470C', textShadow: '1px 1px 4px #2A350D' }}
        >
          {t('add_patient')}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
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
            value={patientUsername}
            onChange={(e) => setPatientUsername(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: '#FFFBEE',
              borderRadius: '10px',
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="gender-label">{t('gender')}</InputLabel>
            <Select
              labelId="gender-label"
              value={gender}
              onChange={(e) => setGender(e.target.value as string)}
              sx={{
                backgroundColor: '#FFFBEE',
                borderRadius: '10px',
              }}
            >
              <MenuItem value="" disabled>
                {t('choose_gender')}
              </MenuItem>
              <MenuItem value="male">{t('male')}</MenuItem>
              <MenuItem value="female">{t('female')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="age-label">{t('age')}</InputLabel>
            <Select
              labelId="age-label"
              value={age}
              onChange={(e) => setAge(e.target.value as string)}
              sx={{
                backgroundColor: '#FFFBEE',
                borderRadius: '10px',
              }}
            >
              <MenuItem value="" disabled>
                {t('selectAge')}
              </MenuItem>
              {Array.from({ length: 10 }, (_, i) => i + 9).map((ageOption) => (
                <MenuItem key={ageOption} value={ageOption.toString()}>
                  {ageOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleCheckboxChange}
                sx={{ color: '#2A470C' }}
              />
            }
            label={t('epilepsy')}
          />
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
      <ToastContainer />
    </Container>
  );
}

export default AddPatientPage;
