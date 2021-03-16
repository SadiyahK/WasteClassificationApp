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

  writeUserData = (data) => {
    if (!firebase.apps.length) {
        firebase.initializeApp({});
     }else {
        firebase.app(); // if already initialized, use that one
     }
    var user = firebase.auth().currentUser;

    if (user) {
      console.log('user logged in')
      const fullDate = new Date().toISOString().
      replace(/T/, ' ').      // replace T with a space
      replace(/\..+/, '')     // delete the dot and everything after
      // > '2012-11-04 14:55:45'

      // var date = new Date().getDate(); //To get the Current Date
      // var month = new Date().getMonth() + 1; //To get the Current Month
      // var year = new Date().getFullYear(); //To get the Current Year
      // var hours = new Date().getHours(); //Current Hours
      // var min = new Date().getMinutes(); //Current Minutes
      // var sec = new Date().getSeconds(); //Current Seconds
      // var fullDate = date + '-' + month + '-' + year 
      // + '-' + hours + '-' + min + '-' + sec
    
      const userId = firebase.auth().currentUser.uid
      console.log(userId)
      console.log(data)
      const location = 'users/' + userId //+ '/' + fullDate
      console.log(location)
      firebase.database().ref(location).set({
        // date: fullDate,
          //material: data,
          meta: {fullDate: data}
      })
      .then(() => {
        console.log('INSERTED !');
      }).catch((error) => {
        console.log(error);
      });
    }else {
    console.log("Not signed in");
    }
}

readUserData = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({});
 }else {
    firebase.app(); // if already initialized, use that one
 }
  //firebase.initializeApp({});
  var user = firebase.auth().currentUser;
    // To select data from firebase every time data has changed !
    if(user){
      const userId = firebase.auth().currentUser.uid
      const location = 'users/'+userId
      firebase.database().ref(location).on('value', (data) => {
        const jsonObj = data.toJSON();
        console.log(jsonObj)
        console.log(jsonObj[0])
        //console.log(jsonObj[0][1]);
      })
    }
}

firebase.initializeApp(firebaseConfig);

export default firebase;