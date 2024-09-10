import React, { useState } from 'react';
import './PatientProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { Button, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
// import { Button, TextField } from '@mui/material';
// import NotesList from '../../ui-components/note/NoteListComponent';
// import SaveIcon from '@mui/icons-material/Save';


function PatientProfilePage() {
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const [selectedOption, setSelectedOption] = useState('');
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  const [infoClicked, setInfoClicked] = useState(false);
  const [notesClicked, setNotesClicked] = useState(true);
  const [statsClicked, setStatsClicked] = useState(false);
  const [resultClicked, setResultClicked] = useState(false);

  const handleInfoClick = () => {
    setInfoClicked(!infoClicked);
  };
  const handleNotesClick = () => {
    setNotesClicked(!notesClicked);
  };
  const handleStatsClick = () => {
    setStatsClicked(!statsClicked);
  };
  const handleResultClick = () => {
    setResultClicked(!resultClicked);

  };
  
  return (
    <div className="patient-profile-container">
      <div className="patient-profile-first-column">
        {laptop && <h1 className="patient-profile-laptop">Patient's profile:</h1>}
        {mobile && <h1 className="patient-profile-mobile">Patient's profile:</h1>}
        {tablet && <h1 className="patient-profile-tablet">Patient's profile:</h1>}
        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={handleInfoClick}
            style={{
              backgroundColor: infoClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">Patient's information:</text>
          </button>
        </div>

        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={handleResultClick}
            style={{
              backgroundColor: resultClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">Results:</text>
          </button>
        </div>
        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={handleStatsClick}
            style={{
              backgroundColor: statsClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">Statistics:</text>
          </button>
        </div>
        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={handleNotesClick}
            style={{
              backgroundColor: notesClicked ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">Notes:</text>
          </button>
        </div>
      </div>

      {/*column 2*/}
      <div className="patient-profile-second-column">
        {infoClicked && (
          <div className="patient-info-input-container">
            <div className="patient-input-wrapper">
              <label htmlFor="name" className="patient-input-label">
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
            <div className="patient-input-wrapper">
              <label htmlFor="lastName" className="patient-input-label">
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

            <div className="patient-input-wrapper">
              <label htmlFor="pesel" className="patient-input-label">
                PESEL:
              </label>
              <TextField
                id="pesel"
                variant="standard"
                name="pesel"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>

            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="dateOfBirth" className="patient-input-label">
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

            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="age" className="patient-input-label">
                First seizure - age:
              </label>
              <TextField
                id="age"
                variant="standard"
                name="age"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>

            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="freq" className="patient-input-label">
                Seizure frequency:
              </label>
              <TextField
                id="freq"
                variant="standard"
                name="freq"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            <div className="space"></div>

            <label className="patient-small-text-button" style={{color:'#FFFBEE'}}>
              {' '}
              Parent contact information

              <select id="contact-method"  value={selectedOption}
                      onChange={handleSelectChange} className="patient-info-dropdown">
                <option value="" disabled>
                  Please select an option
                </option>
                <option value="phone">Phone number</option>
                <option value="email">E-mail address</option>
              </select>
            </label>
            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="contact" className="patient-input-label">
                Contact information:
              </label>
              <TextField
                id="contact"
                variant="standard"
                name="contact"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>

            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="additional" className="patient-input-label">
                Additional information:
              </label>
              <TextField
                id="additional"
                variant="standard"
                name="additional"
                className="info-input"
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
          </div>
        )}
        {notesClicked && (
          <div className="patient-notes-input-container">
            <div className="patient-notes-typing-input-container">
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
        {notesClicked && (
          <div className="patient-note-button-container">
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              style={{ backgroundColor: '#2a470c' }}>
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientProfilePage;
