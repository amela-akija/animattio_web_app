import React from 'react';
import './NoteComponent.css';
import Note from './Note';
import { useTranslation } from 'react-i18next';

interface notes {
  note: Note;
}

const NoteComponent: React.FC<notes> = ({ note }) => {
  const { t } = useTranslation();

  return (
    <div className="note-container">
      <p className="note-details">
        <strong>{t("title")}:</strong> {note.title}
      </p>

      <p className="note-details">
        <strong>{t("date")}:</strong> {note.createdAt}
      </p>
      <p className="note-details">
        <strong>{t('patient_id')}:</strong> {note.patient}
      </p>
      <p className="note-details">
        <strong>{t('content')}:</strong> {note.note}
      </p>
    </div>
  );
};

export default NoteComponent;
