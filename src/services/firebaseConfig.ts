// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyC05DMYpy9CP_VIC-10zeGQMfnUAjdclF4",
  authDomain: "promofacil-6b69e.firebaseapp.com",
  projectId: "promofacil-6b69e",
  storageBucket: "promofacil-6b69e.firebasestorage.app",
  messagingSenderId: "514504253055",
  appId: "1:514504253055:web:47a925ac1f7b6d3db0a94a",
  measurementId: "G-QLCMW7QQJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);