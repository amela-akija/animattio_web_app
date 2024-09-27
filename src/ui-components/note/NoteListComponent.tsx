import React, { useEffect, useState } from 'react';
import './NoteComponent.css';
import NoteComponent from './NoteComponent';
import { fetchNotes } from './getNotes';
import Note from './Note';


const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

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
        <p>No notes available</p>
      )}
    </div>
  );
};

export default NotesList;
