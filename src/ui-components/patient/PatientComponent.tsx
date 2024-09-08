import React from 'react';
import './PatientComponent.css';
import Patient from './Patient';

interface patients {
  patient: Patient;
}

const PatientComponent: React.FC<patients> = ({ patient }) => {

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
      <button className="see-profile-button">See patient's profile</button>
    </div>
  );
};

export default PatientComponent;
