// database/firebaseDb.js

import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDRSfLLqUejkC5ZriaqI35isp6IIxM-wuU",
    authDomain: "rn-classifier-app.firebaseapp.com",
    projectId: "rn-classifier-app",
    storageBucket: "rn-classifier-app.appspot.com",
    messagingSenderId: "610516418891",
    appId: "1:610516418891:web:dc3cf3dbad1638934528ce",
    measurementId: "G-K3HJ46P7R9"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;