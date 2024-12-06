import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TestsList from '../../ui-components/test/TestListComponent';
import MonthlyErrorGraph from './MonthlyErrorGraph';
import DailyErrorGraph from './DailyErrorGraph';
import Legend from '../../ui-components/legend/Legend';
import apiClient from '../../services/apiClient';
import { toast } from 'react-toastify';

function PatientProfilePage() {
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();

  const [activeButton, setActiveButton] = useState<'info' | 'stats' | 'result'>('info');
  const [summedErrors, setSummedErrors] = useState([]);
  // const [tests, setTests] = useState([]);
  const [selectedOption, setSelectedOption] = useState('mode1');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [patientUsername, setPatientUsername] = useState(username || '');
  const [mobileId, setMobileId] = useState('');

  useEffect(() => {
    if (username) {
      localStorage.setItem('clicked_user', username);
      setDocumentId(username);
      setPatientUsername(username);

      const fetchMobileId = async () => {
        try {
          const response = await apiClient.get('/patients/get-patient-id', {
            params: { username },
          });
          if (response.data) {
            setMobileId(response.data.documentId);
          } else {
            toast.error(t('noPermission'));
          }
        } catch (error) {
          toast.error(t('noPermission'));
        }
      };

      fetchMobileId();
    }
  }, [username]);
  useEffect(() => {
    const fetchSummedErrors = async () => {
      if (mobileId) {
        try {
          const response = await apiClient.get(`/tests/summed-errors/${mobileId}`);
          setSummedErrors(response.data);
        } catch (error) {
          toast.error(t('noPermission'));
        }
      }
    };
    fetchSummedErrors();
  }, [mobileId]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const responseGender = await apiClient.get(`/patients/${username}/gender`);
        const responseAge = await apiClient.get(`/patients/${username}/age`);
        const responseType = await apiClient.get(`/patients/${username}/type`);
        setGender(responseGender.data);
        setAge(responseAge.data);
        setType(responseType.data);
      } catch (error) {
        toast.error(t('noPermission'));
      }
    };
    if (username) {
      fetchPatientData();
    }
  }, [username]);

  const handleSaveChanges = async () => {
    const updatedPatient = { patientUsername, gender, age, type };
    try {
      await apiClient.put(`/patients/update-patient?documentId=${documentId}`, updatedPatient);
      setDocumentId(patientUsername);
      toast.success(t('patient_update_success'));
    } catch (error) {
      toast.error(t('patient_update_failure'));
    }
  };

  const handleButtonClick = (button: 'info' | 'stats' | 'result') => {
    setActiveButton(button);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2A470C', fontWeight: 'bold', mb: 3 }}>
          {t('patient_profile')}:
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: activeButton === 'info' ? '#FFC267' : '#FBE3BE',
              color: '#2A470C',
            }}
            onClick={() => handleButtonClick('info')}
          >
            {t('patient_info')}
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: activeButton === 'result' ? '#FFC267' : '#FBE3BE',
              color: '#2A470C',
            }}
            onClick={() => handleButtonClick('result')}
          >
            {t('results')}
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: activeButton === 'stats' ? '#FFC267' : '#FBE3BE',
              color: '#2A470C',
            }}
            onClick={() => handleButtonClick('stats')}
          >
            {t('stats')}
          </Button>
        </Box>

        {activeButton === 'info' && (
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label={t('patientUsername')}
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
              <InputLabel>{t('gender')}</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                sx={{ backgroundColor: '#FFFBEE', borderRadius: '10px' }}
              >
                <MenuItem value="" disabled>
                  {t('selectGender')}
                </MenuItem>
                <MenuItem value="male">{t('male')}</MenuItem>
                <MenuItem value="female">{t('female')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('type')}</InputLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                sx={{ backgroundColor: '#FFFBEE', borderRadius: '10px' }}
              >
                <MenuItem value="" disabled>
                  {t('selectType')}
                </MenuItem>
                <MenuItem value="epilepsy">{t('epilepsy')}</MenuItem>
                <MenuItem value="no epilepsy">{t('noEpilepsy')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('age')}</InputLabel>
              <Select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                sx={{ backgroundColor: '#FFFBEE', borderRadius: '10px' }}
              >
                <MenuItem value="" disabled>
                  {t('selectAge')}
                </MenuItem>
                {Array.from({ length: 10 }, (_, i) => i + 9).map((ageOption) => (
                  <MenuItem key={ageOption} value={ageOption}>
                    {ageOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              endIcon={<BorderColorIcon />}
              onClick={handleSaveChanges}
              sx={{
                color: '#2A470C',
                backgroundColor: '#FFC267',
                '&:hover': { backgroundColor: '#EADAC3' },
              }}
            >
              {t('save')}
            </Button>
          </Box>
        )}

        {activeButton === 'result' && <TestsList tests={summedErrors} />}
        {activeButton === 'stats' && (
          <>
            <Box display="flex" flexDirection="column" gap={2} mb={3}>
              <FormControl fullWidth>
                <InputLabel>{t('test_mode')}</InputLabel>
                <Select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  sx={{ backgroundColor: '#FFFBEE', borderRadius: '10px' }}
                >
                  <MenuItem value="mode1">{t('mode1')}</MenuItem>
                  <MenuItem value="mode2">{t('mode2')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Legend items={[
              { color: 'rgba(17,81,10,0.6)', label: t('Omission') },
              { color: 'rgba(230,199,50,0.9)', label: t('Commission') },
              { color: 'rgba(243,165,9,0.98)', label: t('normativeCommission') },
              { color: 'rgba(102,179,90,0.6)', label: t('normativeOmission') },
            ]} />
            <Box mb={3}>
              <MonthlyErrorGraph
                userId={mobileId}
                selectedMode={selectedOption}
                age={Number(age)}
                gender={gender as 'male' | 'female'}
              />
            </Box>
            <DailyErrorGraph
              userId={mobileId}
              selectedMode={selectedOption}
              age={Number(age)}
              gender={gender as 'male' | 'female'}
            />
          </>
        )}
      </Paper>
    </Container>
  );
}

export default PatientProfilePage;
