import { firestore } from '../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

export async function addDoctor(name: string, lastName: string, role: string, pwz: string, email: string, dateOfBirth: string, uid: string) {
  try {
    const doctorRef = doc(firestore, 'doctors', uid);

    const newDoctor = {
      name: name,
      lastName: lastName,
      pwz: pwz,
      dateOfBirth: dateOfBirth,
      email: email,
      role: role,
    };

    await setDoc(doctorRef, newDoctor);

    console.log("Doctor added with ID: ")
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function addNote(
  title: string,
  patient: string,
  drId: string | null,
  note: string
) {
  try {

    const noteRef = doc(collection(firestore, 'notes'));
    const newNote = {
      title: title,
      patient: patient,
      drId: drId,
      note: note,
      createdAt: new Date()
    };

    await setDoc(noteRef, newNote);

    console.log('Note added with ID:', noteRef.id);
  } catch (error) {
    console.error('Error adding note: ', error);
  }
}