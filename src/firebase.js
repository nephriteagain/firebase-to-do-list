// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth , GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv-3dqXzf5-B3aO0zYR-NqWlGe83QrwOc",
  authDomain: "to-do-list-app-e5eb6.firebaseapp.com",
  projectId: "to-do-list-app-e5eb6",
  storageBucket: "to-do-list-app-e5eb6.appspot.com",
  messagingSenderId: "971196741447",
  appId: "1:971196741447:web:2c9cbd1b785c19814e7e62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const auth = getAuth(app)

export const provider = new GoogleAuthProvider()

