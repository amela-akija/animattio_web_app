import React, { useEffect, useState } from 'react';
import './PatientsListPage.css';
import PatientsList from '../../ui-components/patient/PatientsListComponent';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/apiClient';

interface Patient {
  patientUsername: string;
  gender: string;
  age: number;
  type: string;
}

const SeePatientsPage: React.FC = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const doctorId = localStorage.getItem('doctorUsername');

  const fetchPatients = async () => {
    setLoading(true);
    let url = `http://localhost:8080/patients/get-all-patients?doctorId=${doctorId}`;

    if (searchType === 'age' && searchValue) {
      url = `http://localhost:8080/patients/get-patients-by-age?doctorId=${doctorId}&age=${searchValue}`;
    } else if (searchType === 'gender' && searchValue) {
      url = `http://localhost:8080/patients/get-patients-by-gender?doctorId=${doctorId}&gender=${searchValue}`;
    } else if (searchType === 'username' && searchValue) {
      url = `http://localhost:8080/patients/get-patients-by-username?doctorId=${doctorId}&username=${searchValue}`;
    } else if (searchType === 'type' && searchValue) {
      url = `http://localhost:8080/patients/get-patients-by-type?doctorId=${doctorId}&type=${searchValue}`;
    }

    try {
      const response = await apiClient.get(url);

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const data: Patient[] = response.data;
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchPatients();
  }, [searchType, searchValue]);

  return (
    <div className="patients-list-container">
      <div className="searchContainer">
        <input
          type="text"
          className="searchInput"
          placeholder={t('search')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <select
          className="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}>
          <option value=""></option>
          <option value="username">{t('username')}</option>
          <option value="gender">{t('gender')}</option>
          <option value="age">{t('age')}</option>
          <option value="type">{t('type')}</option>
        </select>
      </div>
      <div className="patients-container">
        {loading ? <p>{t('loading')}</p> : <PatientsList patients={patients} />}
      </div>
    </div>
  );
};

export default SeePatientsPage;
