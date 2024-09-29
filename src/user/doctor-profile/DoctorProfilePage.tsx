import React, { useEffect, useState } from 'react';
import './DoctorProfilePage.css';
import useResponsive from '../../ui-components/useResponsive';
import { Button, TextField } from '@mui/material';
// import NotesList from '../../ui-components/note/NoteListComponent';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslation } from 'react-i18next';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Doctor from './Doctor';
import { addNote, updateNoteWithContent, updateNoteWithTitle } from '../../services/dbService';
import { getAuth } from 'firebase/auth';
// import SeeNotesPage from './NotesList';
import { useNavigate } from 'react-router-dom';

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


// show filed for credentials change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputValue2, setInputValue2] = useState('');
  const [changeCredentials, setChangeCredentials] = useState(false);
  const handleCloseChanges = () => {
    setChangeCredentials(false);
  };
  const handleChangeWindow = () => {
    setChangeCredentials(true);
  };

  const [note] = useState(''); //to create note

  const [title, setTitle] = useState('');
  const handleTitleUpdate = async () => {
    await updateNoteWithTitle(title);
    setShowWindow(false);
    setTitle('');
    setContent('')
  };

  const [content, setContent] = useState('');

  const [showWindow, setShowWindow] = useState(false); // window for title update

  const handleOpenWindow = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowWindow(true);
    const uid = localStorage.getItem('id');
    console.log('uid: ', uid);

    await addNote('no title yet', 'no patient', uid, note);
    console.log('content:'+content);
    await updateNoteWithContent(content);
  };

  const handleCloseWindow = () => {
    setShowWindow(false);
  };
  const navigate = useNavigate();
  const goToNotes = () => {
    navigate('/see-notes'); };


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [editedData, setEditedData] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const uid = localStorage.getItem('id');
      if (uid) {
        const db = getFirestore();
        const dr = doc(db, 'doctors', uid);
        const doctor = await getDoc(dr);

        if (doctor.exists()) {
          const fetchedData = doctor.data() as Doctor;
          setDoctorData(fetchedData);
          setEditedData(fetchedData);
        } else {
          console.log('No document found');
        }
      } else {
        console.log('User not logged in');
      }
    };

    fetchData();
  }, []);
  const handleEditChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [e.target.name]: e.target.value
      });
    }
  };

  const onSave = async () => {
    const uid = localStorage.getItem('id');
    if (uid && editedData) {
      const db = getFirestore();
      const dr = doc(db, 'doctors', uid);

      try {
        const updatedData: Partial<Doctor> = { ...editedData };

        await updateDoc(dr, updatedData);
        setDoctorData(editedData);
        alert(t('data_update'));
      } catch (error) {
        console.error('Error while updating: ', error);
      }
    }
  };

  const [newEmail, setNewEmail] = useState('');

  const auth = getAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = auth.currentUser;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reauthenticateUser = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateEmail = async () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdatePassword = async () => {};

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


      </div>
      <div className="doctor-profile-second-column">
        {infoClicked && (
          <div className="dr-button-container">
            <text className="dr-text">
              {t('message_changes')} <strong> {t('save')}</strong>.<br />
              {t('message_credential')} <strong> {t('change')}</strong>
            </text>
          </div>
        )}

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
                value={editedData?.name || ''}
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
                value={editedData?.lastName || ''}
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
                value={editedData?.pwz || ''}
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
                value={editedData?.dateOfBirth || ''}
                InputProps={{
                  disableUnderline: true
                }}
              />
            </div>
            {changeCredentials && (
              <div className="credentials-container">
                <h2 className="dr-text">{t('change')}</h2>
                <div className="space"></div>
                <div className="input-wrapper2">
                  <label htmlFor="email" className="input-label2">
                    {t('email')}:
                  </label>
                  <TextField
                    id="email"
                    variant="standard"
                    name="email"
                    className="info-input2"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    InputProps={{
                      disableUnderline: true
                    }}
                  />
                </div>
                <div className="space"></div>
                <div className="input-wrapper2">
                  <label htmlFor="password" className="input-label2">
                    {t('password')}:
                  </label>
                  <TextField
                    id="password"
                    variant="standard"
                    type="password"
                    name="password"
                    // value={newEmail}
                    // onChange={(e) => setNewEmail(e.target.value)}
                    className="info-input2"
                    InputProps={{
                      disableUnderline: true
                    }}
                  />
                </div>
                <br />
                <button onClick={handleCloseChanges} className="window-button">
                  {t('close')}
                </button>
                <button onClick={handleCloseChanges} className="window-button">
                  {t('save')}
                </button>
              </div>
            )}
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
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                InputProps={{
                  disableUnderline: true
                }}
                placeholder={t('start_typing')}></TextField>
            </div>
          </div>
        )}
        {infoClicked && <div className="space"></div>}
        {infoClicked && (
          <div className="info-button-container">
            <Button
              variant="contained"
              endIcon={<BorderColorIcon />}
              onClick={onSave}
              style={{ backgroundColor: '#2a470c' }}>
              {t('save')}
            </Button>
            <Button
              variant="contained"
              endIcon={<BorderColorIcon />}
              onClick={handleChangeWindow}
              style={{ backgroundColor: '#2a470c' }}>
              {t('change')}
            </Button>
          </div>
        )}
        {notesClicked && (
          <div className="note-button-container">
            {showWindow && (
              <div className="credentials-container">
                <h2 className="dr-text">{t('add_title')}</h2>
                <div className="space"></div>

                <div className="space"></div>
                <div className="input-wrapper2">
                  <label htmlFor="title" className="input-label2">
                    {t('title')}:
                  </label>
                  <TextField
                    id="title"
                    variant="standard"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="info-input2"
                    InputProps={{
                      disableUnderline: true
                    }}
                  />
                </div>
                <br />
                <button onClick={handleCloseWindow} className="window-button">
                  {t('close')}
                </button>
                <button onClick={async () => {
                  await handleTitleUpdate();
                  alert(t('message_note'));
                }} className="window-button">
                  {t('save')}
                </button>
              </div>
            )}
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              style={{ backgroundColor: '#2a470c' }}
              onClick={async (e) => {
                await handleOpenWindow(e);
              }}>
              {t('save')}
            </Button>
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              style={{ backgroundColor: '#2a470c' }}
              onClick={goToNotes}>
              {t('see_notes')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorProfilePage;
