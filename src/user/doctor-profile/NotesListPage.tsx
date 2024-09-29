import React, { useEffect, useState } from 'react';
import './NotesListPage.css';
import { useTranslation } from 'react-i18next';
import { firestore } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import NoteComponent from '../../ui-components/note/NoteComponent';
import NotesList from '../../ui-components/note/NoteListComponent';
import Note from '../../ui-components/note/Note';

function SeeNotesPage() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<'title' | 'createdAt' | 'patient'>('title');
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [fillInput, setFillInput] = useState(false);

  useEffect(() => {
    const fetchResults = async (value: string) => {
      if (value === '') {
        setFilteredNotes([]);
        return;
      }

      try {
        const notes = collection(firestore, 'notes');
        if(value.length !== 0){
          setFillInput(true);
        }
        const filtered = query(
          notes,
          where(inputValue, '>=',value),
          where(inputValue, '<=', value + '\uf8ff')
        );
        const getNotes = await getDocs(filtered);

        const searchResults: Note[] = [];
        getNotes.forEach((doc) => {
          searchResults.push({ id: doc.id, ...doc.data() } as Note);
        });
        setFilteredNotes(searchResults);
      } catch (error) {
        console.error('Error searching:', error);
      }
    };

    fetchResults(searchValue);
  }, [inputValue, searchValue]);

  return (
    <div className="notes-list-container">
      <div className="notes-searchContainer">
        <input
          type="text"
          className="notes-searchInput"
          placeholder={t('search')}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <select
          className="notes-searchType"
          onChange={(e) => setInputValue(e.target.value as 'title' | 'createdAt' | 'patient')}
          value={inputValue}
        >
          {/*<option value="createdAt">{t('created_at')}</option>*/}
          <option value="patient">{t('patient_id')}</option>
          <option value="title">{t('title')}</option>
        </select>
      </div>
      <div>
        {fillInput && filteredNotes.length === 0 &&(
          <div className="no-notes-text">{t('no_filtered_notes')}</div>
        )}
        {filteredNotes.length === 0 && (
<NotesList></NotesList> )}
        {filteredNotes.length > 0 && (
          <div>
            {filteredNotes.map((note) => (
              <NoteComponent key={note.id} note={note} />
            ))}
          </div>)}

      </div>
    </div>
  );
}

export default SeeNotesPage;
