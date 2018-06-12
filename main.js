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
    firebase.database().ref(window.location.href.split("?")[1]).on("value", function(snapshot) {
      if(snapshot.val().author == localStorage.name) {
        document.getElementById("edit-page").style.display = "block";
        document.getElementById("story-title-input").value = snapshot.val().title;
        document.getElementById("story-text-area").value = snapshot.val().content;
        document.getElementById("save-story-btn").onclick = saveStory();
      } else {
        document.getElementById("story-page").style.display = "block";
        document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.val().title + "</h1><h5> By " + snapshot.val().author + "</h5></center><p>" + snapshot.val().content + "</p>";
      }
    });
  }
}
