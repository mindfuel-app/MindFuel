// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_9D6RZbly8G5PVkiwX3EwWpF-b2KM6jA",
  authDomain: "mindfuelapp.firebaseapp.com",
  projectId: "mindfuelapp",
  storageBucket: "mindfuelapp.appspot.com",
  messagingSenderId: "683302168116",
  appId: "1:683302168116:web:f7dedb8eaed7d64ac9cc61",
  measurementId: "G-KMQBZS95Z8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);