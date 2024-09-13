import React, { useState } from 'react';
import useResponsive from '../../ui-components/useResponsive';
import './AddPatientPage.css';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

function AddPatientPage() {
  const { t } = useTranslation();
  const { isMobile: mobile, isTablet: tablet, isLaptop: laptop } = useResponsive();
  const [checked, setChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };
  const handleCheckboxChange = () => {
    setChecked(!checked);
  };
  return (
    <div className="add-patient-container">
      <div className="add-patient-first-column">
        {laptop && <h1 className="add-patient-laptop">{t('add_patient')}</h1>}
        {mobile && <h1 className="add-patient-mobile">{t('add_patient')}</h1>}
        {tablet && <h1 className="add-patient-tablet">{t('add_patient')}</h1>}

        <div className="add-patient-input-container">
          <label className="add_label"> {t('name')}:</label>
          <TextField
            id="name"
            variant="standard"
            name="name"
            className="add-patient-input"
            InputProps={{
              disableUnderline: true
            }}
          />
        </div>
        <div className="add-patient-input-container">
          <label className="add_label"> {t('last_name')}:</label>

          <TextField
            id="lastNname"
            variant="standard"
            InputProps={{
              disableUnderline: true
            }}
            name="lastName"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <label className="add_label"> PESEL:</label>

          <TextField
            id="pesel"
            variant="standard"
            InputProps={{
              disableUnderline: true
            }}
            name="pesel"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <label className="add_label"> {t('date_of_birth')}:</label>
          <TextField
            id="dateOfBirth"
            variant="standard"
            InputProps={{
              disableUnderline: true
            }}
            name="dateOfBirth"
            className="add-patient-input"
          />
        </div>
      </div>

      <div className="add-patient-second-column">
        {laptop && <h1 className="add-patient-dot-laptop">add patient</h1>}

        <div className="add-patient-input-container">
          <label className="add_label"> {t('seizure')}:</label>
          <TextField
            id="seizure"
            variant="standard"
            InputProps={{
              disableUnderline: true
            }}
            name="seizure"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <label className="add_label"> {t('freq')}:</label>
          <TextField
            id="freq"
            variant="standard"
            InputProps={{
              disableUnderline: true
            }}
            name="freq"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <label className="add_label"> {t('additional_info')}:</label>
          <TextField
            id="info"
            variant="standard"
            InputProps={{
              disableUnderline: true
            }}
            name="info"
            className="add-patient-input"
          />
        </div>

        <div className="add-patient-input-container">
          <label className="info-small-text-button">
            {' '}
            {t("parent_contact_info")}
            <select
              id="contact-method"
              value={selectedOption}
              onChange={handleSelectChange}
              className="info-dropdown">
              <option value="" disabled>
                {t("option")}
              </option>
              <option value="phone">{t("phone")}</option>
              <option value="email">{t("email")}</option>
            </select>
          </label>
        </div>
        {selectedOption === 'phone' && (
          <div className="add-patient-input-container">
            <label className="add_label"> {t('contact_info')}:</label>
            <TextField
              id="contact"
              InputProps={{
                disableUnderline: true
              }}
              variant="standard"
              name="contact"
              className="add-patient-input"
            />
          </div>
        )}

        {selectedOption === 'email' && (
          <div className="add-patient-input-container">
            <label className="add_label"> {t('contact_info')}:</label>
            <TextField
              id="contact"
              variant="standard"
              name="contact"
              InputProps={{
                disableUnderline: true
              }}
              className="add-patient-input"
            />
          </div>
        )}
        {laptop && (
          <div className="save-button-container">
            <button className="save-patient-button">
              <text className="save-text-button"> Add</text>
            </button>
          </div>
        )}
      </div>
      <div className="add-patient-third-column">
        {laptop && <h1 className="add-patient-dot-laptop">add patient</h1>}
        <label className="checkbox">
          <input type="checkbox" checked={checked} onClick={handleCheckboxChange} />
          {t("pharmacological")}
        </label>
        {checked && (
          <div className="add-patient-additional-input-container">
            <label className="add_label"> {t('meds')}:</label>
            <TextField
              id="medication"
              InputProps={{
                disableUnderline: true
              }}
              variant="standard"
              name="medication"
              className="add-patient-additional-input"
            />
          </div>
        )}
        {mobile && (
          <div className="save-button-container">
            <button className="save-patient-button">
              <text className="save-text-button"> Add</text>
            </button>
          </div>
        )}
        {tablet && (
          <div className="save-button-container">
            <button className="save-patient-button">
              <text className="save-text-button"> Add</text>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPatientPage;
