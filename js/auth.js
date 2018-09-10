var user = firebase.auth().currentUser;

function login() {
  firebase.auth().signInWithEmailAndPassword(document.getElementById('signin-uname').innerHTML + '@fakeemail.com', document.getElementById('signin-password')).then(function() {
    console.log('Successfuly logged in!');
    window.location.href = '/';
  }).catch(function(error) {
    throw error;
    alert(error);
  });
}
