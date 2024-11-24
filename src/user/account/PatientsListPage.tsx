import React, { useEffect, useState } from 'react';
import './PatientsListPage.css';
import PatientsList from '../../ui-components/patient/PatientsListComponent';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/apiClient';
import debounce from 'lodash.debounce';

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
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const doctorId = localStorage.getItem('doctorUsername');

  const fetchPatients = async (searchValueOverride?: string) => {
    setLoading(true);
    let url = `http://localhost:8080/patients/get-all-patients?doctorId=${doctorId}`;

    if (searchType === 'age' && ageRange.min && ageRange.max) {
      url = `http://localhost:8080/patients/get-patients-by-age-range?doctorId=${doctorId}&minAge=${ageRange.min}&maxAge=${ageRange.max}`;
    } else if (searchType === 'gender' && searchValue) {
      url = `http://localhost:8080/patients/get-patients-by-gender?doctorId=${doctorId}&gender=${searchValue}`;
    } else if (searchType === 'username' && (searchValueOverride || searchValue)) {
      const usernameToSearch = searchValueOverride || searchValue;
      url = `http://localhost:8080/patients/get-patients-by-username?doctorId=${doctorId}&username=${usernameToSearch}`;
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
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPatients = debounce((value: string) => {
    fetchPatients(value);
  }, 300);

  useEffect(() => {
    if (searchType === 'username' && searchValue) {
      debouncedFetchPatients(searchValue);
    } else {
      fetchPatients();
    }

    return () => {
      debouncedFetchPatients.cancel();
    };
  }, [searchType, searchValue, ageRange]);

  return (
    <div className="patients-list-container">
      <div className="searchContainer">
        <select
          className="searchType"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">{t('choose_search_type')}</option>
          <option value="username">{t('username')}</option>
          <option value="gender">{t('gender')}</option>
          <option value="age">{t('age')}</option>
          <option value="type">{t('type')}</option>
        </select>

        {searchType === 'username' && (
          <input
            type="text"
            className="searchInput"
            placeholder={t('enter_username')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}

        {searchType === 'gender' && (
          <select
            className="searchInput"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <option value="">{t('choose_gender')}</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
          </select>
        )}

        {searchType === 'age' && (
          <div className="ageRange">
            <input
              type="number"
              className="ageInput"
              placeholder={t('min_age')}
              value={ageRange.min}
              onChange={(e) => setAgeRange({ ...ageRange, min: e.target.value })}
            />
            <input
              type="number"
              className="ageInput"
              placeholder={t('max_age')}
              value={ageRange.max}
              onChange={(e) => setAgeRange({ ...ageRange, max: e.target.value })}
            />
          </div>
        )}

        {searchType === 'type' && (
          <select
            className="searchInput"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <option value="">{t('choose_type')}</option>
            <option value="epilepsy">{t('epilepsy')}</option>
            <option value="non-epilepsy">{t('non_epilepsy')}</option>
          </select>
        )}
      </div>
      <div className="patients-container">
        {loading ? <p>{t('loading')}</p> : <PatientsList patients={patients} />}
      </div>
    </div>
  );
};

export default SeePatientsPage;
