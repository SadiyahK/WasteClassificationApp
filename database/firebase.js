/**
 * firebase: has configurations for firebase user authentication
 */

import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBA_m5AC2Sz1UYyJwXvN-FSvD06hyxqCTo",
    authDomain: "wasteclassifier-8cf5b.firebaseapp.com",
    projectId: "wasteclassifier-8cf5b",
    storageBucket: "wasteclassifier-8cf5b.appspot.com",
    messagingSenderId: "906309487655",
    appId: "1:906309487655:web:4b183796e6d0dceb37d202",
    measurementId: "G-6NQR1E3976"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;