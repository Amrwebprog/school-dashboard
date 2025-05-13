// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig2 = {
    apiKey: "AIzaSyBS7c4fTEhnpS_gI7V6iSpZ4NidfU1k3F8",
    authDomain: "website-data-d8367.firebaseapp.com",
    projectId: "website-data-d8367",
    storageBucket: "website-data-d8367.firebasestorage.app",
    messagingSenderId: "541688373291",
    appId: "1:541688373291:web:63b146bf76870c23704a6e",
    measurementId: "G-BBMN74HM64"
};

// Initialize Firebase with a custom name for the second app
const app2 = initializeApp(firebaseConfig2, "app2");
const db2 = getFirestore(app2);

export { db2 };