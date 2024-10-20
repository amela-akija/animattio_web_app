import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo-web-navbar.png';
import Sidebar from '../sidebar/Sidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleAddPatient = () => {
    setActiveTab('/add-patient');
    navigate('/add-patient');
  };

  const handleSeePatients = () => {
    setActiveTab('/see-patients');
    navigate('/see-patients');
  };

  const handleUserProfile = () => {
    setActiveTab('/doctor-profile');
    navigate('/doctor-profile');
  };

  // Check if the current page is an authentication page
  const isAuthPage = activeTab === '/' || activeTab === '/signup' || activeTab === '/login';

  return (
    <nav className="navbar">
      <a href="/">
        <img src={logo} alt="logo" className="navbar-logo" />
      </a>
      {!isAuthPage && (
        <div className="navbar-tabs">
          {/* Show buttons based on activeTab */}
          {activeTab === '/add-patient' ? (
            <>
              <button className="navbar-tab" onClick={handleUserProfile}>
                User Profile
              </button>
              <button className="navbar-tab" onClick={handleSeePatients}>
                See Patients
              </button>
            </>
          ) : activeTab === '/see-patients' ? (
            <>
              <button className="navbar-tab" onClick={handleAddPatient}>
                Add Patient
              </button>
              <button className="navbar-tab" onClick={handleUserProfile}>
                User Profile
              </button>
            </>
          ) : activeTab === '/doctor-profile' ? (
            <>
              <button className="navbar-tab" onClick={handleAddPatient}>
                Add Patient
              </button>
              <button className="navbar-tab" onClick={handleSeePatients}>
                See Patients
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
