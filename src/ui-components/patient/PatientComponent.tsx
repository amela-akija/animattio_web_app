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
      <button className="see-profile-button" onClick={goToPatientProfile}>{t("see_patient_profile")}</button>
    </div>
  );
};

export default PatientComponent;
