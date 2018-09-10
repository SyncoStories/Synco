// Initialize Firebase
var config = {
  apiKey: "AIzaSyB3FDjwLrfTfSBWRo4-z_S5o9D1rFh8ulU",
  authDomain: "synco-c1c21.firebaseapp.com",
  databaseURL: "https://synco-c1c21.firebaseio.com",
  projectId: "synco-c1c21",
  storageBucket: "synco-c1c21.appspot.com",
  messagingSenderId: "333441973483"
};
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

//Set up ayth user
var user = firebase.auth().currentUser;
