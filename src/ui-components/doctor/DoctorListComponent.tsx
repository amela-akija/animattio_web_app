import React from 'react';
import './DoctorComponent.css';
import Doctor from './Doctor';
import DoctorComponent from './DoctorComponent';

interface Doctors {
  doctors: Doctor[]; // Array of Doctor objects to be displayed in the list
}

const DoctorsList: React.FC<Doctors> = ({ doctors }) => {
  return (
    <div className="patient-list">
      {doctors.map((doctor) => (
        <DoctorComponent key={doctor.username} doctor={doctor} /> // // Renders each doctor
      ))}
    </div>
  );
};

export default DoctorsList;
