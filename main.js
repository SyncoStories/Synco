function hideAllPages() {
  for (var i = 0; i < document.getElementsByClassName("page").length; i++) {
    document.getElementsByClassName("page")[i].style.display = "none";
  }
}

if (!window.location.href.split("?")[1]) {
  hideAllPages();
  document.getElementById("main-page").style.display = "block";
  //load stories
  firebase.database().ref().once("value", function(snapshot) {
    snapshot.forEach(function(storySnapshot) {
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'index.html?' + storySnapshot.key + '\'"><font class="card-title">' + storySnapshot.val().title + '</font><p>By ' + storySnapshot.val().author + '</p></span>';
    });
  });
} else {
  if(document.getElementById(window.location.href.split("?")[1] + "-page")) {
    hideAllPages();
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block";
  } else {
    hideAllPages();
    document.getElementById("story-page").style.display = "block";
    firebase.database().ref(window.location.href.split("?")[1]).on("value", function(snapshot) {
      document.getElementById("story-page").innerHTML = "<h1><center>" + snapshot.val().title + "</center></h1><h5> By " + snapshot.val().author + "</h5><p>" + snapshot.val().content + "</p>";
    });
  }
}
