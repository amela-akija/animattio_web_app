import React, { useEffect, useState } from 'react';
import './DoctorProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { Button, TextField } from '@mui/material';
import NotesList from '../../ui-components/note/NoteListComponent';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { getFirestore, doc, getDoc, updateDoc  } from 'firebase/firestore';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Doctor from './Doctor';

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

  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [editedData, setEditedData] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const uid = localStorage.getItem('id');
      if (uid) {
        const db = getFirestore();
        const dr = doc(db, "doctors", uid);
        const doctor = await getDoc(dr);

        if (doctor.exists()) {
          const fetchedData = doctor.data() as Doctor;
          setDoctorData(fetchedData);
          setEditedData(fetchedData);
        } else {
          console.log("No document found");
        }
      } else {
        console.log("User not logged in");
      }
    };

    fetchData();
  }, []);
  const handleEditChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onSave = async () => {
    const uid = localStorage.getItem('id');
    if (uid && editedData) {
      const db = getFirestore();
      const dr = doc(db, "doctors", uid);

      try {
        const updatedData:Partial<Doctor> = { ...editedData };

        await updateDoc(dr, updatedData);
        setDoctorData(editedData);
        alert(t('data_update'))
      } catch (error) {
        console.error("Error while updating: ", error);
      }
    }
  };

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
                onChange={handleEditChanges}
                name="name"
                value={editedData?.name || t('no_data')}
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
                onChange={handleEditChanges}
                name="lastName"
                value={editedData?.lastName || t('no_data')}
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
                onChange={handleEditChanges}
                value={editedData?.pwz || t('no_data')}
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
                onChange={handleEditChanges}
                value={doctorData?.dateOfBirth || t('no_data')}
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            <div className="space"></div>
            <div className="input-wrapper">
              <label htmlFor="email" className="input-label">
                {t('email')}:
              </label>
              <TextField
                id="email"
                variant="standard"
                name="email"
                onChange={handleEditChanges}
                className="info-input"
                value={doctorData?.email || t('no_data')}
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
        {infoClicked && (
          <div className="space"></div>
        )}
        {infoClicked && (
          <Button
          variant="contained"
          endIcon={<BorderColorIcon />}
          onClick={onSave}
        style={{ backgroundColor: '#2a470c' }}>
        {t('save')}
      </Button>
      )}
      {notesClicked && (
        <div className="note-button-container">
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              style={{ backgroundColor: '#2a470c' }}>
              {t('save')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfilePage;
