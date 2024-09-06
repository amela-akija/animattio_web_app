import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './authentication/MainPage';
import Navbar from './ui-components/Navbar';
import LoginPage from './authentication/LoginPage';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup"  />
      </Routes>
     </Router>
  );
}

export default App;
