var user = firebase.auth().currentUser;

if(user) {
  document.getElementById('navbar-uname-dropdown').innerHTML = user.email.replace('@fakeemail.com', '');
  document.getElementById('navbar-uname-dropdown').style.display = 'inline-block';
  document.getElementById('navbar-login-signup').style.display = 'none';
} else {
  document.getElementById('navbar-login-signup').style.display = 'inline-block';
  document.getElementById('navbar-uname-dropdown').style.display = 'none';
}

function login() {
  firebase.auth().signInWithEmailAndPassword(document.getElementById('signin-uname').value + '@fakeemail.com', document.getElementById('signin-password').value).then(function() {
    console.log('Successfuly logged in!');
    window.location.href = '/';
  }).catch(function(error) {
    throw error;
    alert(error);
  });
}

function logout() {
  firebase.auth().signOut().then(function() {
    window.location.href = '/';
  }).catch(function(error) {
    throw error;
    console.log(error);
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

firebase.auth().onAuthStateChanged(function(userInfo) {
  if (userInfo) {
    user = userInfo;
  } else {
    user = null;
  }
});
