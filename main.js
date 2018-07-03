const admins = ['prealge', 'Tel-of-lolth', 'synco', 'isy123'];

function createNewStory() {
  var newStory = firebase.database().ref().child("stories").push({
    title: document.getElementById("story-title-input").value,
    author: localStorage.name,
    content: document.getElementById("story-text-area").innerHTML,
    likes: 0,
    tags: document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').slice(0, document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').length - 1)
  });
  firebase.database().ref().on("child_added", function() {
    window.location.href = "?" + newStory.key
  });
}

function saveStory() {
  if (window.location.href.split("?")[1]) {
    var storyRef = firebase.database().ref("stories/" + window.location.href.split("?")[1]);
    storyRef.child(document.getElementById("story-title-input").value);
    storyRef.child("author").set(localStorage.name);
    storyRef.child("content").set(document.getElementById("story-text-area").innerText);
    storyRef.child("tags").set(document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').slice(0, document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').length - 1));
  }
}

function getStoryInfo(storyId) {
  var toReturn;
  firebase.database().ref("stories/" + storyId).once("value", function(snapshot) {
    toReturn = snapshot.val();
  });
  return toReturn;
}

function deleteStory(storyId) {
  var storyAuthor;
  firebase.database().ref("stories/" + storyId + "/author").on("value", function(snapshot) {
    storyAuthor = snapshot.val();
  });
  if (localStorage.name == storyAuthor || admins.includes(localStorage.name)) {
    if (confirm("Are you sure that you want to delete this story? It will be gone forever")) {
      if (prompt("Enter the story's name to confirm") == getStoryInfo(storyId).title) {
        firebase.database().ref("stories/" + storyId).remove();
        alert("The story has been sucessfully deleted!");
        window.location.href = "index.html";
      } else {
        alert("Incorrect title");
      }
    }
  } else {
    alert("Access Denied");
  }
}

function likeStory(storyId) {
  firebase.database().ref("stories/" + storyId + "/likes").transaction(function(likes) {
    if (likes) {
      return likes - 1
    } else {
      return -1
    }
  });
}

function addTag() {
  if (document.getElementById("tags-input").value !== '') {
    document.getElementById("tags").innerHTML += '<tag onclick="this.parentElement.removeChild(this)">' + document.getElementById("tags-input").value + '</tag>';
    document.getElementById("tags-input").value = '';
  }
}

function loadStories(snapshot) {
  document.getElementById('story-cards').innerHTML = '';
  snapshot.forEach(function(storySnapshot) {
      if (storySnapshot.val().likes == -1) {
        var likeLikes = "Like"
      } else {
        var likeLikes = "Likes"
      }
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'index.html?' + storySnapshot.key + '\'"><font class="card-title">' + storySnapshot.val().title + '</font><p>By ' + storySnapshot.val().author + ' </p><p>' + storySnapshot.val().likes * -1 + ' ' + likeLikes + '</p></span>';
    });
}

function loadStoriesByAuthor(author) {
  firebaase.database().ref("stories").orderByChild('author').equalTo(author).once("value", function(snapshot) {
    loadStories(snapshot);
  });
}

function loadStoriesByLikes() {
  firebase.database().ref("stories").orderByChild("likes").once("value", function(snapshot) {
    loadStories(snapshot);
  });
}

function hideAllPages() {
  for (var i = 0; i < document.getElementsByClassName("page").length; i++) {
    document.getElementsByClassName("page")[i].style.display = "none";
  }
}

hideAllPages();
if (!window.location.href.split("?")[1]) {
  document.getElementById("main-page").style.display = "block";
  loadStoriesByLikes();
} else {
  if (document.getElementById(window.location.href.split("?")[1] + "-page")) {
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block"
  } else {
    firebase.database().ref("stories/" + window.location.href.split("?")[1]).on("value", function(snapshot) {
      if (snapshot.val()) {
        if (snapshot.val().author == localStorage.name) {
          document.getElementById("edit-page").style.display = "block";
          document.getElementById("story-title-input").value = snapshot.val().title;
          document.getElementById("story-text-area").innerHTML = snapshot.val().content;
          document.getElementById("tags").innerHTML = "";
          if (snapshot.val().tags) {
            for (var i = 0; i < snapshot.val().tags.length; i++) {
              document.getElementById("tags").innerHTML += '<tag onclick="this.parentElement.removeChild(this)">' + snapshot.val().tags[i] + '</tag>';
            }
          }
          document.getElementById("save-story-btn").onclick = saveStory;
        } else {
          document.getElementById("story-page").style.display = "block";
          document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.val().title + "</h1><h5> By " + snapshot.val().author + "</h5></center><p>" + snapshot.val().content + "</p>";
          if (snapshot.val().tags) {
            for (var i = 0; i < snapshot.val().tags.length; i++) {
              document.getElementById("story-page").innerHTML += "<tag>" + snapshot.val().tags[i] + "</tag>";
            }
          }
          if (localStorage.name !== "null") {
            document.getElementById("story-page").innerHTML += "<br><br><button class='btn-primary' onclick='likeStory(\"" + window.location.href.split("?")[1] + "\")'>Like</button>";
          }
          if(admins.includes(localStorage.name)) {
            document.getElementById("story-page").innerHTML += "<button class='btn-primary' onclick='deleteStory(\"" + window.location.href.split("?")[1] + "\")'>Delete</button>";
          }
        }
      } else {
        document.getElementById("story-404-page").style.display = "block";
      }
    });
  }
}
