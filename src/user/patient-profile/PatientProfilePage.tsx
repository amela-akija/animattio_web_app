import React, { forwardRef, useState } from 'react';
import './PatientProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { Button, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import NotesList from '../../ui-components/note/NoteListComponent';
import TestsList from '../../ui-components/test/TestListComponent';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

const tests = [
  {
    id: 'pIqWxP87HaZjuosGDgIk1nw0x2W2',
    mode: 'mode2',
    timestamp: 'September 2, 2024 at 8:51:18 PM UTC+2'
  },
  {
    id: 'pIqWxP87HaZjuosGDgIk1nw0x2W2',
    mode: 'mode2',
    timestamp: 'September 2, 2024 at 8:51:18 PM UTC+2'
  }
];
const StartDateInput = forwardRef<HTMLInputElement, { value: string; onClick: () => void }>(
  ({ value, onClick }, ref) => {
    const { t } = useTranslation();

    return (
      <div className="arrow-wrapper" onClick={onClick}>
        <input
          ref={ref}
          value={value}
          readOnly
          className="calendar-input"
          placeholder={t("start_date")}
        />
        <div className="arrow">&#9662;</div>
      </div>
    );
  }
);
const EndDateInput = forwardRef<HTMLInputElement, { value: string; onClick: () => void }>(
  ({ value, onClick }, ref) => {
    const { t } = useTranslation();

    return (
      <div className="arrow-wrapper" onClick={onClick}>
        <input
          ref={ref}
          value={value}
          readOnly
          className="calendar-input"
          placeholder={t("end_date")}
        />
        <div className="arrow">&#9662;</div>
      </div>
    );
  }
);

function PatientProfilePage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();

  const [selectedOption, setSelectedOption] = useState('');
  const [activeButton, setActiveButton] = useState<'info' | 'notes' | 'stats' | 'result'>('info');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleButtonClick = (button: 'info' | 'notes' | 'stats' | 'result') => {
    setActiveButton(button);
  };


  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  return (
    <div className="patient-profile-container">
      <div className="patient-profile-first-column">
        {laptop && <h1 className="patient-profile-laptop">{t('patient_profile')}:</h1>}
        {mobile && <h1 className="patient-profile-mobile">{t('patient_profile')}:</h1>}
        {tablet && <h1 className="patient-profile-tablet">{t('patient_profile')}:</h1>}
        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={() => handleButtonClick('info')}
            style={{
              backgroundColor: activeButton === 'info' ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">{t('patient_info')}:</text>
          </button>
        </div>

        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={() => handleButtonClick('result')}
            style={{
              backgroundColor: activeButton === 'result' ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">{t('results')}:</text>
          </button>
        </div>
        <div className="patient-button-container">
          <button
            onClick={() => handleButtonClick('stats')}
            className="patient-button"
            style={{
              backgroundColor: activeButton === 'stats' ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">{t('stats')}:</text>
          </button>
        </div>
        <div className="patient-button-container">
          <button
            className="patient-button"
            onClick={() => handleButtonClick('notes')}
            style={{
              backgroundColor: activeButton === 'notes' ? '#FFC267' : '#FBE3BE'
            }}>
            <text className="patient-text-button">{t('notes')}:</text>
          </button>
        </div>
        {/*{activeButton === 'notes' && <NotesList notes={notes}></NotesList>}*/}
        {activeButton === 'result' && <div className="space"></div>}
        {activeButton === 'result' && <TestsList tests={tests} />}

        {activeButton === 'stats' && (
          <div className="stats-dropdown-container">
            <label className="patient-small-text-button" style={{ color: '#2A470C' }}>
              {' '}
              {t('game_mode')}:
              <select
                id="gamemode"
                value={selectedOption}
                onChange={handleSelectChange}
                className="stats-dropdown">
                <option value="" disabled>
                  {t('message_game')}
                </option>
                <option value="mode1">{t('mode1')}</option>
                <option value="mode2">{t('mode2')}</option>
              </select>
            </label>
          </div>
        )}
        {activeButton === 'stats' && (
          <div className="stats-dropdown-container">
            <label className="patient-small-text-button" style={{ color: '#2A470C' }}>
              {' '}
              {t('parameter')}:
              <select
                id="parameter"
                value={selectedOption}
                onChange={handleSelectChange}
                className="stats-dropdown">
                <option value="" disabled>
                  {t('message_parameter')}
                </option>
                <option value="omissionParameter">{t('Omission')}</option>
                <option value="comissionParameter">{t('Comission')}</option>
                <option value="hitRateParameter">{t('Hit_rate')}</option>
                <option value="reactionParameter">{t('Reaction_time')}</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {/*column 2*/}
      {/**/}
      {/**/}
      <div className="patient-profile-second-column">
        {activeButton === 'info' && (
          <div className="patient-info-input-container">
            <div className="patient-input-wrapper">
              <label htmlFor="name" className="patient-input-label">
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
            <div className="patient-input-wrapper">
              <label htmlFor="lastName" className="patient-input-label">
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

            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="age" className="patient-input-label">
                {t('seizure')}:
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
                {t('freq')}:
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

            <label className="patient-small-text-button" style={{ color: '#FFFBEE' }}>
              {' '}
              {t('parent_contact_info')}
              <select
                id="contact-method"
                value={selectedOption}
                onChange={handleSelectChange}
                className="patient-info-dropdown">
                <option value="" disabled>
                  {t('message_contact')}
                </option>
                <option value="phone">{t('phone')}</option>
                <option value="email">{t('email')}</option>
              </select>
            </label>
            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="contact" className="patient-input-label">
                {t('contact_info')}:
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
                {t('additional_info')}:
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
        {activeButton === 'result' && <div className="big-space"></div>}
        {activeButton === 'result' && (
          <div className="patient-info-input-container">
            <div className="patient-input-wrapper">
              <label htmlFor="date" className="patient-input-label">
                {t('date')}:
              </label>
              <input id="dateOfGame" name="dateOfGame" className="info-input" readOnly />
            </div>
            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="mode" className="patient-input-label">
                {t('game_mode')}:
              </label>
              <input id="mode" name="mode" className="info-input" readOnly />
            </div>
            <div className="space"></div>

            <div className="patient-input-wrapper">
              <label htmlFor="omission" className="patient-input-label">
                {t('omission')}:
              </label>
              <input id="omission" name="omission" className="info-input" readOnly />
            </div>

            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="comission" className="patient-input-label">
                {t('comission')}:
              </label>
              <input id="comission" name="comission" className="info-input" readOnly />
            </div>

            <div className="space"></div>
            <div className="patient-input-wrapper">
              <label htmlFor="reactionTime" className="patient-input-label">
                {t('reaction_time')}:
              </label>
              <input id="reactionTime" name="reactionTime" className="info-input" readOnly />
            </div>
          </div>
        )}

        {activeButton === 'notes' && (
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
                placeholder={t('start_typing')}></TextField>
            </div>
          </div>
        )}
        {activeButton === 'notes' && (
          <div className="patient-note-button-container">
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              style={{ backgroundColor: '#2a470c' }}>
              {t("save")}
            </Button>
          </div>
        )}
        {activeButton === 'stats' && (
          <div className="dates">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              customInput={
                <StartDateInput
                  onClick={() => {}}
                  value={selectedDate ? selectedDate.toDateString() : ''}
                />
              }
              calendarClassName="calendar"
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              customInput={
                <EndDateInput
                  onClick={() => {}}
                  value={selectedDate ? selectedDate.toDateString() : ''}
                />
              }
              calendarClassName="calendar"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientProfilePage;
