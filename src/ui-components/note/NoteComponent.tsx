import React from 'react';
import './NoteComponent.css';
import Note from './Note';

interface notes {
  note: Note;
}

const NoteComponent: React.FC<notes> = ({ note }) => {

  return (
    <div className="note-container">
      <p className="note-details">
        <strong>Title:</strong> {note.title}
      </p>

      <p className="note-details">
        <strong>Date:</strong> {note.date}
      </p>
      <p className="note-details">
        <strong>Patient:</strong> {note.patient}
      </p>
    </div>
  );
};

export default NoteComponent;
