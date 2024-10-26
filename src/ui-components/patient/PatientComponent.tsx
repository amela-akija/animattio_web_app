import React from 'react';
import './PatientComponent.css';
import Patient from './Patient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Patients {
  patient: Patient;
}

const PatientComponent: React.FC<Patients> = ({ patient }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToPatientProfile = (username: string) => {
    navigate(`/patient-profile/${username}`);
  };
  const displayType = () => {
    switch (patient.type) {
      case 'epilepsy':
        return t('epilepsy');
      case 'no epilepsy':
        return t('noEpilepsy');
      default:
        return 'N/A';
    }
  };


  return (
    <div className="patient-container">
      <p className="patient-details">
        <strong>{t("username")}:</strong> {patient.patientUsername}
      </p>
      <p className="patient-details">
        <strong>{t("gender")}:</strong> {patient.gender}
      </p>
      <p className="patient-details">
        <strong>{t("age")}:</strong> {patient.age}
      </p>
      <p className="patient-details">
        <strong>{t("type")}:</strong> {patient.type}
      </p>
      <button className="see-profile-button" onClick={() => goToPatientProfile(patient.patientUsername)}>
        {t("see_patient_profile")}
      </button>
    </div>
  );
};

export default PatientComponent;
