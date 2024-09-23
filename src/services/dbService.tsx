import { firestore } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export async function addDoctor(name: string, lastName: string, pwz: string, email: string, uid: string) {
  try {
    const doctorRef = doc(firestore, 'doctors', uid);

    const newDoctor = {
      name: name,
      lastName: lastName,
      pwz: pwz,
      email: email,
    };

    await setDoc(doctorRef, newDoctor);

    console.log("Doctor added with ID: ")
  } catch (error) {
    console.error("Error: ", error);
  }
}
