import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import Note from './Note';



export const fetchNotes = async (): Promise<Note[]> => {
  try {
    const notesCollectionRef = collection(firestore, 'notes');
    const querySnapshot = await getDocs(notesCollectionRef);
    const notes: Note[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      notes.push({
        id: doc.id,
        title: data.title,
        note: data.note,
        patient: data.patient,
        createdAt: data.createdAt.toDate().toLocaleString(),
      });
    });

    return notes;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};
