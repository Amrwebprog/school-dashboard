// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBamMpy7st5aMFgEQ3MYL2wEllAi5VjN_I",
  authDomain: "student-attendence-55ea6.firebaseapp.com",
  projectId: "student-attendence-55ea6",
  storageBucket: "student-attendence-55ea6.appspot.com",
  messagingSenderId: "396377442425",
  appId: "1:396377442425:web:4d1206f328a7588fb06ca8",
  measurementId: "G-NH99C6TYG4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export { db };