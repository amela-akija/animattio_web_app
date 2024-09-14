import React from 'react';
import './PatientComponent.css';
import Patient from './Patient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface patients {
  patient: Patient;
}

const PatientComponent: React.FC<patients> = ({ patient }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const goToPatientProfile = () => {
    navigate('/patient-profile');
  };
  return (
    <div className="patient-container">
      <p className="patient-details">
        <strong>{t("name")}:</strong> {patient.name}
      </p>
      <p className="patient-details">
        <strong>{t("last_name")}:</strong> {patient.lastName}
      </p>
      <p className="patient-details">
        <strong>{t("email")}:</strong> {patient.email}
      </p>
      <p className="patient-details">
        <strong>PESEL:</strong> {patient.pesel}
      </p>
      <button className="see-profile-button" onClick={goToPatientProfile}>{t("see_patient_profile")}</button>
    </div>
  );
};

export default PatientComponent;
