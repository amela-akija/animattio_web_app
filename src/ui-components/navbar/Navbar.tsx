import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo-web-navbar.png';
import Sidebar from '../sidebar/Sidebar';
import { t } from 'i18next';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.pathname);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleLogoClick = () => {
    if (!isAuthPage) {
      if (userRole === 'admin') {
        navigate('/see-doctors');
      } else if (userRole === 'doctor') {
        navigate('/see-patients');
      }
    }
  };

  const handleAddPatient = () => {
    setActiveTab('/add-patient');
    navigate('/add-patient');
  };

  const handleAddDoctor = () => {
    setActiveTab('/see-doctors');
    navigate('/add-doctor');
  };

  const handleSeePatients = () => {
    setActiveTab('/see-patients');
    navigate('/see-patients');
  };

  const handleSeeDoctors = () => {
    setActiveTab('/add-doctor');
    navigate('/see-doctors');
  };

  const handleUserProfile = () => {
    setActiveTab('/doctor-profile');
    navigate('/doctor-profile');
  };

  const isAuthPage = activeTab === '/' || activeTab === '/login';
  const isTestResultsPage = location.pathname.startsWith('/test-results/');

  return (
    <nav className="navbar">
      <a href="#" onClick={handleLogoClick}>
        <img src={logo} alt="logo" className="navbar-logo" />
      </a>
      {!isAuthPage && (
        <div className="navbar-tabs">
          {activeTab === '/add-patient' || isTestResultsPage ? (
            <>
              <button className="navbar-tab" onClick={handleUserProfile}>
                {t('userProfile')}
              </button>
              <button className="navbar-tab" onClick={handleSeePatients}>
                {t('seePatients')}
              </button>
            </>
          ) : activeTab === '/see-patients' ? (
            <>
              <button className="navbar-tab" onClick={handleAddPatient}>
                {t('addPatient')}
              </button>
              <button className="navbar-tab" onClick={handleUserProfile}>
                {t('userProfile')}
              </button>
            </>
          ) : activeTab === '/add-doctor' ? (
            <>
              <button className="navbar-tab-admin" onClick={handleSeeDoctors}>
                {t('seeDoctors')}
              </button>
            </>
          ) : activeTab === '/see-doctors' ? (
            <>
              <button className="navbar-tab-admin" onClick={handleAddDoctor}>
                {t('addDoctor')}
              </button>
            </>
          ) : activeTab === '/doctor-profile' ? (
            <>
              <button className="navbar-tab" onClick={handleAddPatient}>
                {t('addPatient')}
              </button>
              <button className="navbar-tab" onClick={handleSeePatients}>
                {t('seePatients')}
              </button>
            </>
          ) : activeTab === '/patient-profile' ? (
            <>
              <button className="navbar-tab" onClick={handleAddPatient}>
                {t('addPatient')}
              </button>
              <button className="navbar-tab" onClick={handleSeePatients}>
                {t('seePatients')}
              </button>
            </>
          ) : null}
        </div>
      )}
      <Sidebar />
    </nav>
  );
};

export default Navbar;
