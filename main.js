function hideAllPages() {
  for (var i = 0; i < document.getElementsByClassName("page").length; i++) {
    document.getElementsByClassName("page")[i].style.display = "none";
  }
}

if (!window.location.href.split("?")[1]) {
  hideAllPages();
  document.getElementById("main-page").style.display = "block";
} else {
  if(document.getElementById(window.location.href.split("?")[1] + "-page")) {
    hideAllPages();
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block";
  } else {
    hideAllPages();
    document.getElementById("story-page").style.display = "block";
    firebase.database().ref(window.location.href.split("?")[1]).on(function(snapshot) {
      document.getElementById("story-page").innerHTML = snapshot.val().content;
    });
  }
}
