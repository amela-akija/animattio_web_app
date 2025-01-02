import React, { useEffect, useState } from 'react';
import './DoctorListPage.css';
import { useTranslation } from 'react-i18next';
import DoctorsList from '../ui-components/doctor/DoctorListComponent';
import apiClient from '../services/apiClient';
// Doctor object
interface Doctor {
  username: string;
}

const SeeDoctorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState<Doctor[]>([]); // // State to store the list of doctors
  const [loading, setLoading] = useState(true); // State to track the loading status
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const fetchDoctors = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get('/doctors/get-doctor-list');
      if (response.status !== 200) {
        throw new Error('Network response was not ok'); // Handles error responses
      }
      const data: Doctor[] = await response.data; // // Extracts data from the response
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to fetch doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(); // Ensures data is fetched as soon as the component is displayed to the user
  }, []); // Trigger array is empty, so it will only run 1 time on the first render.
  // It allows to fetch data immediately on load and then never again

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
