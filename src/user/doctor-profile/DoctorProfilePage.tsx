import React, { useState } from 'react';
import './DoctorProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { Button, TextField } from '@mui/material';
import NotesList from '../../ui-components/note/NoteListComponent';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
const notes = [
  {
    title: 'First Note',
    date: '2024-09-10',
    patient: 'John Doe'
  },
  {
    title: 'Second Note',
    date: '2024-09-11',
    patient: null
  },
  {
    title: 'Third Note',
    date: '2024-09-12'
  },
  {
    title: 'Fourth Note',
    date: '2024-09-13',
    patient: 'Jane Smith'
  }
];

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
  const { t } = useTranslation();
  return (
    <div className="doctor-profile-container">
      <div className="doctor-profile-first-column">
        {laptop && <h1 className="doctor-profile-laptop">{t('doctor_profile')}:</h1>}
        {mobile && <h1 className="doctor-profile-mobile">{t('doctor_profile')}:</h1>}
        {tablet && <h1 className="doctor-profile-tablet">{t('doctor_profile')}:</h1>}
        <div className="dr-button-container">
          <button
            className="dr-button"
            onClick={handleInfoClick}
            style={{
              backgroundColor: infoClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="dr-text-button">{t('doctor_info')}:</text>
          </button>
        </div>

        <div className="dr-button-container">
          <button
            className="dr-button"
            onClick={handleNotesClick}
            style={{
              backgroundColor: notesClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="dr-text-button">{t('notes')}:</text>
          </button>
        </div>
        {notesClicked && <NotesList notes={notes}></NotesList>}
      </div>
      <div className="doctor-profile-second-column">
        {infoClicked && (
          <div className="info-input-container">
            <div className="input-wrapper">
              <label htmlFor="name" className="input-label">
                {t('name')}:
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
                {t('last_name')}:
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
                {t('date_of_birth')}:
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
                placeholder={t('start_typing')}></TextField>
            </div>
          </div>
        )}
        {notesClicked && (
          <div className="note-button-container">
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              style={{ backgroundColor: '#2a470c' }}>
              {t("save")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfilePage;
