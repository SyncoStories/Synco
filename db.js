// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyB3FDjwLrfTfSBWRo4-z_S5o9D1rFh8ulU",
  authDomain: "synco-c1c21.firebaseapp.com",
  databaseURL: "https://synco-c1c21.firebaseio.com",
  projectId: "synco-c1c21",
  storageBucket: "synco-c1c21.appspot.com",
  messagingSenderId: "333441973483"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

var user = firebase.auth().currentUser;

function signup() {
  var newUsername = document.getElementById("new-account-uname").value;
  var newPassword = document.getElementById("new-account-pword").value;
  //firebase.database().ref().child("profiles").push({
  //  username: newUsername
  //});
  firebase.auth().createUserWithEmailAndPassword(newUsername + "@fakeemail.com", newPassword).then(function() {
    window.location.href = "index.html";
  }).catch(function(error) {
    alert(error)
  });
  user = firebase.auth().currentUser;
}

function signin() {
  var uname = document.getElementById("signin-uname").value;
  var password = document.getElementById("signin-password").value;
  firebase.auth().signInWithEmailAndPassword(uname + "@fakeemail.com", password).then(function() {
    user = firebase.auth().currentUser;
    window.location.href = "https://sycno.tk";
  }).catch(function(error) {
    alert(error);
  });
}

function signout() {
  firebase.auth().signOut().then(function() {
    console.log("signed out");
  }).catch(function(error) {
    console.log(error);
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    document.getElementById("navbar-username").innerHTML = "<div class='dropdown' style='float: right'><a class='toggle-dropdown'>" + user.email.replace("@fakeemail.com", "") + "</a><ul style='right: 0px; color: gray; max-height: 100px; margin: 20px 10px;'><li onclick='window.location.href = \"?edit\";'>Make a New Story</li><li onclick='window.location.href = \"?mystories\"'>My Stories</li><li onclick='signout()'>Logout</li></ul>";  
    localStorage.name = user.email.split("@")[0];
  } else {
    document.getElementById("navbar-username").innerHTML = "<button class='btn-primary' style='background-color: white; margin: 0; font-size: 100%;'><a href=\"index.html?login\" style='color: tomato'>Login</a></button>  <button class='btn-primary' style='background-color: white; margin: 0; font-size: 100%;'><a href='index.html?signup' style='color: tomato'>Signup</a></button>";
    localStorage.name = "";
  }
});
