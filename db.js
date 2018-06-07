  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3FDjwLrfTfSBWRo4-z_S5o9D1rFh8ulU",
    authDomain: "synco-c1c21.firebaseapp.com",
    databaseURL: "https://synco-c1c21.firebaseio.com",
    projectId: "synco-c1c21",
    storageBucket: "",
    messagingSenderId: "333441973483"
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
  var password = document.getElementById("signin-password").value;
  firebase.auth().signInWithEmailAndPassword(uname, password).catch(function(error) {
    alert(error);
  });
}
