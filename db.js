// Initialize Firebase
var config = {
  apiKey: "AIzaSyD5_yUpUvanX8_X9lh7CwjMdo3WpXYr8wc",
  authDomain: "synco-9daf9.firebaseapp.com",
  databaseURL: "https://synco-9daf9.firebaseio.com",
  projectId: "synco-9daf9",
  storageBucket: "synco-9daf9.appspot.com",
  messagingSenderId: "1089239747248"
};
firebase.initializeApp(config);

window.dbRef = firebase.database().ref();

function signup() {
  var newUserName = document.getElementById("new-account-uname").value;
  var newPassword = document.getElementById("new-account-pword").value;
  firebase.auth().createUserWithEmailAndPassword(newUserName + "@fakeemail.com", newPassword).catch(function(error) {
    alert(error)
  });
}

function signin() {
  var uname = document.getElementById("singnin-uname").value;
  var password = documet.getElementById("signin-password").value;
  firebase.auth().signInWithEmailAndPassword(uname, password).catch(function(error) {
    alert(error);
  });
}
