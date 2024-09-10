import React from 'react';
import './PatientComponent.css';
import Patient from './Patient';
import { useNavigate } from 'react-router-dom';

interface patients {
  patient: Patient;
}

const PatientComponent: React.FC<patients> = ({ patient }) => {
  const navigate = useNavigate();
  const goToPatientProfile = () => {
    navigate('/patient-profile');
  };
  return (
    <div className="patient-container">
      <p className="patient-details">
        <strong>Name:</strong> {patient.name}
      </p>
      <p className="patient-details">
        <strong>Last name:</strong> {patient.lastName}
      </p>
      <p className="patient-details">
        <strong>E-mail:</strong> {patient.email}
      </p>
      <p className="patient-details">
        <strong>PESEL:</strong> {patient.pesel}
      </p>
      <button className="see-profile-button" onClick={goToPatientProfile}>See patient's profile</button>
    </div>
  );
};

export default PatientComponent;
