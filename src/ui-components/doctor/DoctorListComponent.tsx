import React from 'react';
import './DoctorComponent.css';
import Doctor from './Doctor';
import DoctorComponent from './DoctorComponent';

interface Doctors {
  doctors: Doctor[];
}

const DoctorsList: React.FC<Doctors> = ({ doctors }) => {
  return (
    <div className="patient-list">
      {doctors.map((doctor) => (
        <DoctorComponent key={doctor.username} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorsList;
