import React, { useEffect, useState } from 'react';
import './PatientsListPage.css';
import PatientsList from '../../ui-components/patient/PatientsListComponent'; // Uncomment to use PatientsList
import { useTranslation } from 'react-i18next';

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
  const doctorId = localStorage.getItem('doctorUsername');

  const fetchPatients = async () => {
    try {
      const response = await fetch(`http://localhost:8080/patients/get-all-patients?doctorId=${doctorId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Patient[] = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="patients-list-container">
      <div className="searchContainer">
        <input type="text" className="searchInput" placeholder={t('search')} />
        <select className="searchType">
          <option value="">{t("all")}</option>
          <option value="email">{t("email")}</option>
          <option value="pesel">PESEL</option>
          <option value="lastName">{t("last_name")}</option>
        </select>
      </div>
      <div className="patients-container">
        {loading ? (
          <p>{t('loading')}</p>
        ) : (
          <PatientsList patients={patients} />
        )}
      </div>
    </div>
  );
};

export default SeePatientsPage;
