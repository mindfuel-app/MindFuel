importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyC_9D6RZbly8G5PVkiwX3EwWpF-b2KM6jA",
  authDomain: "mindfuelapp.firebaseapp.com",
  projectId: "mindfuelapp",
  storageBucket: "mindfuelapp.appspot.com",
  messagingSenderId: "683302168116",
  appId: "1:683302168116:web:f7dedb8eaed7d64ac9cc61",
  measurementId: "G-KMQBZS95Z8"
});

const messaging = firebase.messaging();