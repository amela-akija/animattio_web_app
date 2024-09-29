import React, { useEffect, useState } from 'react';
import './NoteComponent.css';
import NoteComponent from './NoteComponent';
import { fetchNotes } from './fetchNotes';
import Note from './Note';
import { useTranslation } from 'react-i18next';



const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadNotes = async () => {
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
    };

    loadNotes();
  }, []);

  return (
    <div className="note-list">
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteComponent key={note.id} note={note} />
        ))
      ) : (
        <p className="dr-text">{t('no_notes')}</p>
      )}
    </div>
  );
};

export default NotesList;
