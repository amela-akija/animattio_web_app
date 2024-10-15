import React from 'react';
import './PatientComponent.css';
import Patient from './Patient';
import PatientComponent from './PatientComponent';

interface Patients {
  patients: Patient[];
}

const PatientsList: React.FC<Patients> = ({ patients }) => {
  return (
    <div className="patient-list">
      {patients.map((patient) => (
        <PatientComponent key={patient.patientUsername} patient={patient} />
      ))}
    </div>
  );
};

export default PatientsList;
