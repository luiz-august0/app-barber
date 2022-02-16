import firebase from "firebase"
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyDIQTXmRiPr-IDncJcgA8iTYOUwWWqEbdA",
    authDomain: "barber-5f478.firebaseapp.com",
    projectId: "barber-5f478",
    storageBucket: "barber-5f478.appspot.com",
    messagingSenderId: "898775242713",
    appId: "1:898775242713:web:a60d3092930eb64c43abc8",
    measurementId: "G-WJW9Z9MHG0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase