import React from 'react';
import './DoctorComponent.css';
import Doctor from './Doctor';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Doctors {
  doctor: Doctor;
}

const DoctorComponent: React.FC<Doctors> = ({ doctor }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToDoctorProfile = (username: string) => {
    navigate(`/doctor-profile/${username}`);
  };


  return (
    <div className="doctor-container">
      <p className="doctor-details">
        <strong>{t("username")}:</strong> {doctor.username}
      </p>
      <button className="see-profile-button" onClick={() => goToDoctorProfile(doctor.username)}>
        {t("seeDoctorProfile")}
      </button>
    </div>
  );
};

export default DoctorComponent;
