import { firestore } from '../firebaseConfig';
import { setDoc,doc } from 'firebase/firestore';



export async function addDoctor(username: string, role: string, uid: string) {
  try {
    const doctorRef = doc(firestore, 'doctors', uid);

    const newDoctor = {
      username: username,
      role: role,
    };

    await setDoc(doctorRef, newDoctor);

    console.log("Doctor added with ID: ")
  } catch (error) {
    console.error("Error: ", error);
  }

}