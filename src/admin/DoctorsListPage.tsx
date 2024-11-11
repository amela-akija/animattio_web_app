import React, { useEffect, useState } from 'react';
import './DoctorListPage.css';
import { useTranslation } from 'react-i18next';
import DoctorsList from '../ui-components/doctor/DoctorListComponent';
import apiClient from '../services/apiClient';

interface Doctor {
  username: string;
}

const SeeDoctorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get('/doctors/get-doctor-list');
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      const data: Doctor[] = await response.data;
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="patients-list-container">
      <div className="patients-container">
        {loading ? (
          <p>{t('loading')}</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <DoctorsList doctors={doctors} />
        )}
      </div>
    </div>
  );
};

export default SeeDoctorsPage;
