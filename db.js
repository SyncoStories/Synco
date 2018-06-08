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

var user = firebase.auth().currentUser;

function signup() {
  var newUsername = document.getElementById("new-account-uname").value;
  var newPassword = document.getElementById("new-account-pword").value;
  var newEmail = document.getElementById("new-account-email").value;
  firebase.auth().createUserWithEmailAndPassword(newEmail, newPassword).catch(function(error) {
    alert(error)
  });
  user = firebase.auth().currentUser;
  user.updateProfile({
    displayName: newUsername
  }).then(function() {
    
  }).catch(function(error) {
    console.log(error);
  });
}

function signin() {
  var uname = document.getElementById("signin-uname").value;
  var password = document.getElementById("signin-password").value;
  firebase.auth().signInWithEmailAndPassword(uname + "@fakeemail.com", password).catch(function(error) {
    alert(error);
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  user = firebase.auth().currentUser;
  if (user !== null) {
    openPage("main");
    document.getElementById("navbar-username").innerHTML = user.displayName;
  } else {
    openPage("main");
    document.getElementById("navbar-username").innerHTML = '<a onclick="openPage(\'login\')">Login</a> or <a onclick="openPage(\'signup\')">Signup</a>';
  }
});
