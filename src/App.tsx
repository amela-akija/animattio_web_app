import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './authentication/MainPage';
import Navbar from './ui-components/navbar/Navbar';
import LoginPage from './authentication/LoginPage';
import SignupPage from './authentication/SignupPage';
import MainUserPage from './user/account/MainUserPage';
import AddPatientPage from './user/account/AddPatientPage';
import SeePatientsPage from './user/account/PatientsListPage';
import DoctorProfilePage from './user/doctor-profile/DoctorProfilePage';
import PatientProfilePage from './user/patient-profile/PatientProfilePage';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
function App() {
  return (
    <Router>
      <I18nextProvider i18n={i18n}>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user-account" element={<MainUserPage />} />
        <Route path="/add-patient" element={<AddPatientPage />} />
        <Route path="/see-patients" element={<SeePatientsPage />} />
        <Route path="/doctor-profile" element={<DoctorProfilePage />} />
        <Route path="/patient-profile" element={<PatientProfilePage />} />



      </Routes>
      </I18nextProvider>
    </Router>
  );
}

export default App;
