// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlK81UOFMkaS88w-Hvc-lQ6DOnA8qR5jM",
  authDomain: "ai-summarizer-e401e.firebaseapp.com",
  projectId: "ai-summarizer-e401e",
  storageBucket: "ai-summarizer-e401e.firebasestorage.app",
  messagingSenderId: "680624453041",
  appId: "1:680624453041:web:8fc452d5a7108a7dbfb990",
  measurementId: "G-VM167V1LE2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);