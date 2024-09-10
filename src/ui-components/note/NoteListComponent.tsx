import React from 'react';
import './NoteComponent.css';
import Note from './Note';
import NoteComponent from './NoteComponent';

interface Notes {
  notes: Note[];
}

const NotesList: React.FC<Notes> = ({ notes }) => {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteComponent key={note.title} note={note} />
      ))}
    </div>
  );
};

export default NotesList;
