import firebase from 'firebase';
let firebaseConfig = {
  apiKey: 'AIzaSyCb6TEZ11n9TS_zunqvWDXCzWzKqDuV3HU',
  authDomain: 'livefit-cc5f1.firebaseapp.com',
  projectId: 'livefit-cc5f1',
  storageBucket: 'livefit-cc5f1.appspot.com',
  messagingSenderId: '680656392461',
  appId: '1:680656392461:web:f992c475232c0a84cf6044',
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
const db = fb.firestore();

export default db;
