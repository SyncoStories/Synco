function createNewStory() {
  var newStory = firebase.database().ref().child('/').push({
    title: document.getElementById("story-title-input").value,
    author: localStorage.name,
    content: document.getElementById("story-text-area").innerText
  });
  window.location.href = "index.html?" + newStory.key;
}

function saveStory() { 
  if(window.location.href.split("?")[1]) {
    firebase.database().ref().child(window.location.href.split("?")[1]).child("title").set(document.getElementById("story-title-input").value);
    firebase.database().ref().child(window.location.href.split("?")[1]).child("author").set(localStorage.name);
    firebase.database().ref().child(window.location.href.split("?")[1]).child("content").set(document.getElementById("story-text-area").innerText);
  }
}



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
      document.getElementById('story-cards').innerHTML += '<div class="row"><div class="col s12 m6"><div class="card red darken-1" onclick="window.location.href = \'?' + storySnapshot.key + '\'"><div class="card-content white-text"><span class="card-title">' + storySnapshot.val().title + '</span><p>By ' + storySnapshot.val().author + '</p></div></div></div></div>';
    });
  });
} else {
  if(document.getElementById(window.location.href.split("?")[1] + "-page")) {
    hideAllPages();
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block";
  } else {
    hideAllPages();
    firebase.database().ref(window.location.href.split("?")[1]).on("value", function(snapshot) {
      if(snapshot.val()) {
        if(snapshot.val().author == localStorage.name) {
          document.getElementById("edit-page").style.display = "block";
          document.getElementById("story-title-input").value = snapshot.val().title;
          document.getElementById("story-text-area").innerHTML = snapshot.val().content;
          document.getElementById('story-text-area').addEventListener("keyup", saveStory, false);     
          document.getElementById("story-title-input").onkeyup = saveStory;
          document.getElementById("save-story-btn").style.display = "none";
        } else {
          document.getElementById("story-page").style.display = "block";
          document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.val().title + "</h1><h5> By " + snapshot.val().author + "</h5></center><p>" + snapshot.val().content + "</p>";
        }
      } else {
        document.getElementById("story-404-page").style.display = "block";
      }
    });
  }
}
