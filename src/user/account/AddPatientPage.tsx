import React, { useState } from 'react';
import useResponsive from '../../ui-components/useResponsive';
import './AddPatientPage.css';
import { TextField } from '@mui/material';

function AddPatientPage() {
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
        {laptop && <h1 className="add-patient-laptop">Add patient:</h1>}
        {mobile && <h1 className="add-patient-mobile">Add patient:</h1>}
        {tablet && <h1 className="add-patient-tablet">Add patient:</h1>}

        <div className="add-patient-input-container">
          <TextField
            id="name"
            label="Name"
            variant="standard"
            name="name"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <TextField
            id="lastNname"
            label="Last name"
            variant="standard"
            name="lastName"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <TextField
            id="pesel"
            label="PESEL"
            variant="standard"
            name="pesel"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <TextField
            id="dateOfBirth"
            label="Date of Birth"
            variant="standard"
            name="dateOfBirth"
            className="add-patient-input"
          />
        </div>
      </div>

      <div className="add-patient-second-column">
        {laptop && <h1 className="add-patient-dot-laptop">add patient</h1>}
        {mobile && <h1 className="add-patient-dot-mobile">add patient</h1>}
        {tablet && <h1 className="add-patient-dot-tablet">add patient</h1>}

        <div className="add-patient-input-container">
          <TextField
            id="seizure"
            label="First seizure - age"
            variant="standard"
            name="seizure"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <TextField
            id="freq"
            label="Seizure frequency"
            variant="standard"
            name="freq"
            className="add-patient-input"
          />
        </div>
        <div className="add-patient-input-container">
          <TextField
            id="info"
            label=" Additional information"
            variant="standard"
            name="info"
            className="add-patient-input"
          />
        </div>

        <div className="add-patient-input-container">
          <label className="info-small-text-button">
            {' '}
            Parent contact information
            <select
              id="contact-method"
              value={selectedOption}
              onChange={handleSelectChange}
              className="info-dropdown">
              <option value="" disabled>
                Please select an option
              </option>
              <option value="phone">Phone number</option>
              <option value="email">E-mail address</option>
            </select>
          </label>
        </div>
        {selectedOption === 'phone' && (
          <div className="add-patient-input-container">
            <TextField
              id="contact"
              label="Contact information"
              variant="standard"
              name="contact"
              className="add-patient-input"
            />
          </div>
        )}

        {selectedOption === 'email' && (
          <div className="add-patient-input-container">
            <TextField
              id="contact"
              label="Contact information"
              variant="standard"
              name="contact"
              className="add-patient-input"
            />
          </div>
        )}
        <div className="save-button-container">
          <button className="save-patient-button">
            <text className="save-text-button"> Add</text>
          </button>
        </div>
      </div>
      <div className="add-patient-third-column">
        {laptop && <h1 className="add-patient-dot-laptop">add patient</h1>}
        {mobile && <h1 className="add-patient-dot-mobile">add patient</h1>}
        {tablet && <h1 className="add-patient-dot-tablet">add patient</h1>}
        <label className="checkbox">
          <input type="checkbox" checked={checked} onClick={handleCheckboxChange} />
          pharmacological treatment
        </label>
        {checked && (
          <div className="add-patient-additional-input-container">
            <TextField
              id="medication"
              label="Medication description"
              variant="standard"
              name="medication"
              className="add-patient-additional-input"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPatientPage;
