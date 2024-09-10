import React, { useState } from 'react';
import './DoctorProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { TextField } from '@mui/material';

function DoctorProfilePage() {
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const [infoClicked, setInfoClicked] = useState(true);
  const [notesClicked, setNotesClicked] = useState(false);
  const handleInfoClick = () => {
    setInfoClicked(!infoClicked);
    setNotesClicked(!notesClicked);
  };
  const handleNotesClick = () => {
    setNotesClicked(!notesClicked);
    setInfoClicked(!infoClicked);
  };
  return (
    <div className="doctor-profile-container">
      <div className="doctor-profile-first-column">
        {laptop && <h1 className="doctor-profile-laptop">Doctor's profile:</h1>}
        {mobile && <h1 className="doctor-profile-mobile">Doctor's profile:</h1>}
        {tablet && <h1 className="doctor-profile-tablet">Doctor's profile:</h1>}
        <div className="dr-button-container">
          <button
            className="dr-button"
            onClick={handleInfoClick}
            style={{
              backgroundColor: infoClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="dr-text-button">Doctor's information:</text>
          </button>
        </div>

        <div className="dr-button-container">
          <button
            className="dr-button"
            onClick={handleNotesClick}
            style={{
              backgroundColor: notesClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="dr-text-button">Notes:</text>
          </button>
        </div>
      </div>
      <div className="doctor-profile-second-column">
        {infoClicked && (
          <div className="info-input-container">
            <div className="input-wrapper">
              <label htmlFor="name" className="input-label">
                Name:
              </label>
              <TextField
                id="name"
                variant="standard"
                name="name"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            <div className="space"></div>
            <div className="input-wrapper">
              <label htmlFor="lastName" className="input-label">
                Last name:
              </label>
              <TextField
                id="lastNname"
                variant="standard"
                name="lastName"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            <div className="space"></div>

            <div className="input-wrapper">
              <label htmlFor="pwz" className="input-label">
                PWZ:
              </label>
              <TextField
                id="pwz"
                variant="standard"
                name="pwz"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>

            <div className="space"></div>
            <div className="input-wrapper">
              <label htmlFor="dateOfBirth" className="input-label">
                Date of birth:
              </label>
              <TextField
                id="dateOfBirth"
                variant="standard"
                name="dateOfBirth"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
          </div>
        )}
        {notesClicked && (
          <div className="notes-input-container">
            <div className="notes-typing-input-container">
              <TextField
                id="notes"
                className="full-size"
                multiline
                rows={15}
                maxRows={15}
                variant="standard"
                InputProps={{
                  disableUnderline: true
                }}
                placeholder="Start typing..."></TextField>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfilePage;
