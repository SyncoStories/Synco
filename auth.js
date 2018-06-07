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
