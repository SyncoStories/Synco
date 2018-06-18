function createNewStory() {
  var newStory = firebase.database().ref().child("stories").push({
    title: document.getElementById("story-title-input").value,
    author: localStorage.name,
    content: document.getElementById("story-text-area").innerHTML,
    likes: 0
  });
  window.location.href = "index.html?" + newStory.key;
}

function saveStory() { 
  if(window.location.href.split("?")[1]) {
    var storyRef = firebase.database().ref("stories/" + window.location.href.split("?")[1]);
    storyRef.child(document.getElementById("story-title-input").value);
    storyRef.child("author").set(localStorage.name);
    storyRef.child("content").set(document.getElementById("story-text-area").innerText);
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
  if(confirm("Are you sure that you want to delete this story? It will be gone forever")){
    if(prompt("Enter the story's name to confirm") == getStoryInfo(storyId).title) {
      firebase.database().ref("stories/" + storyId).remove();
      alert("The story has been sucessfully deleted!");
      window.location.href = "index.html";
    } else {
      alert("Incorrect title");
    }
  }
}

function likeStory(storyId) {
   firebase.database().ref("stories/" + storyId + "/likes").transaction(function(likes) {
  if(likes) {
    return likes - 1
  } else {
    return - 1
  }
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
  //load stories
 firebase.database().ref("stories").orderByChild("likes").once("value", function(snapshot) { 
   snapshot.forEach(function(storySnapshot) {
     if(storySnapshot.val().likes == -1) {
       var likeLikes = "Like"
     } else {
       var likeLikes = "Likes"
     }
     document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'index.html?' + storySnapshot.key + '\'"><font class="card-title">' + storySnapshot.val().title + '</font><p>By ' + storySnapshot.val().author + ' </p><p>' + storySnapshot.val().likes  * -1 + ' ' + likeLikes + '</p></span>';
    });
 });
} else {
  if(document.getElementById(window.location.href.split("?")[1] + "-page")) {
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block"
  } else {
    firebase.database().ref("stories/" + window.location.href.split("?")[1]).on("value", function(snapshot) {
      if(snapshot.val()) {
          if(snapshot.val().author == localStorage.name) {
            document.getElementById("edit-page").style.display = "block";
            document.getElementById("story-title-input").value = snapshot.val().title;
            document.getElementById("story-text-area").innerHTML = snapshot.val().content;
            document.getElementById("save-story-btn").onclick = saveStory;
          } else {
            document.getElementById("story-page").style.display = "block";
            document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.val().title + "</h1><h5> By " + snapshot.val().author + "</h5></center><p>" + snapshot.val().content + "</p>";
            if(localStorage.name !== "null") {
              document.getElementById("story-page").innerHTML += "<br><br><button class='btn-primary' onclick='likeStory(\"" + window.location.href.split("?")[1] + "\")'>Like</button>";
            }
          }
      } else {
        document.getElementById("story-404-page").style.display = "block";
      }
    });
  }
}

//STORY EDIT DROPDOWN
document.onclick = function() {
  if(!mouseOverStoryEditMenu) {
    document.getElementById("story-edit-menu").style.display = 'none'
  }
}
