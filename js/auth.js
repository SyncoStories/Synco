var user = firebase.auth().currentUser;

function login() {
  firebase.auth().signInWithEmailAndPassword(document.getElementById('signin-uname').value + '@fakeemail.com', document.getElementById('signin-password').value).then(function() {
    console.log('Successfuly logged in!');
    window.location.href = '/';
  }).catch(function(error) {
    throw error;
    alert(error);
  });
}


function signup() {
  firebase.auth().creteUserWithEmailAndPassword(document.getElementById('new-account-uname').value + '@fakeemail.com', document.getElementById('new-user-password').value).then(function() {
    console.log('Your account has been created!');
    window.location.href = '/';
  }).catch(function(error) {
    throw error;
    alert(error);
  });
}
