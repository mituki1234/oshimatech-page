// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5HPmixsNpNGPWbhb9032BBnur17xFzBM",
  authDomain: "oshimatech-db.firebaseapp.com",
  databaseURL: "https://oshimatech-db-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oshimatech-db",
  storageBucket: "oshimatech-db.firebasestorage.app",
  messagingSenderId: "917707004539",
  appId: "1:917707004539:web:a331a4d5218b3afe50e0de",
  measurementId: "G-7E17MVN5LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client-side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Realtime Database and get a reference to the service
const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, db, auth, provider };