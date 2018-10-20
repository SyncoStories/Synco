function createNewStory() {
   var buttonToLoad = document.getElementById("save-story-btn");
   buttonToLoad.innerHTML = "<i class='fas fa-circle-notch'></i>";
   db.collection("stories").add({
     title: document.getElementById("story-title-input").value,
     author: localStorage.name,
     content: document.getElementById("story-text-area").innerHTML,
     uid: firebase.auth().currentUser.uid,
     tags: document.getElementById("tags-input").value.split(","),
     published: true,
     likes: []
   }).then(function(docRef) {
     window.location.href = "?" + docRef.id + "?edit";
     buttonToLoad.innerHTML = "<i class='fas fa-save'></i>";
   }).catch(function(error) {
     alert(error);
     throw error;
     buttonToLoad.innerHTML = "<i class='fas fa-exclamation'></i>";
   });
 }

function saveStory() {
  if (window.location.href.split("?")[1]) {
    var buttonToLoad = document.getElementById("save-story-btn");
    buttonToLoad.innerHTML = "<i class='fas fa-circle-notch'></i>";
    db.collection("stories").doc(window.location.href.split("?")[1]).update({
      title: document.getElementById("story-title-input").value,
      author: localStorage.name,
      content: document.getElementById("story-text-area").innerHTML,
      uid: firebase.auth().currentUser.uid,
      tags: document.getElementById("tags-input").value.split(",")
    }).then(function() {
      buttonToLoad.innerHTML = "<i class='fas fa-save'></i>";
    }).catch(function(error) {
      alert(error);
      throw error;
      buttonToLoad.innerHTML = "<i class='fas fa-exclamation'></i>";
    });
  }
}

function likeStory(storyId) {
  db.collection("stories").doc(storyId).get().then(function(snapshot) {
     let likes = snapshot.data().likes.push(firebase.auth().currentUser.uid);
    db.collection("stories").doc(storyId).update({
      likes: likes
    });
  });
}


function rateStory(storyId, rating) {
  db.collection("stories").doc(storyId).collection("ratings").add(rating);
}

function getStoryInfo(storyId) {
  var toReturn;
  db.collection("stories").doc(storyId).get().then(function(snapshot) {
    toReturn = snapshot.data();
  });
  return toReturn;
}

function deleteStory(storyId) {
  if (confirm("Are you sure that you would like to delete this story? All data will be permanently lost.")) {
    db.collection("stories").doc(storyId).delete().then(function() {
      alert("The story has been successfully deleted!");
    }).catch(function(error) {
      alert(error);
    });
  }
}

function loadStories(ref) {
  hideAllPages();
  document.getElementById("main-page").style.display = "block";
  ref.get().then(function(snapshot) {
    document.getElementById('story-cards').innerHTML = '';
    snapshot.forEach(function(storySnapshot) {
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'https://synco.tk/?' + storySnapshot.id + '\'"><font class="card-title">' + storySnapshot.data().title + '</font><p><i class="fas fa-address-card"></i> ' + storySnapshot.data().author + ' </p><p><i class="fas fa-thumbs-up"></i> ' + storySnapshot.data().likes.length + '</p></span>';
    });
  });
}

function hideAllPages() {
  for (var i = 0; i < document.getElementsByClassName("page").length; i++) {
    document.getElementsByClassName("page")[i].style.display = "none";
  }
}


hideAllPages();
if (!window.location.href.split("?")[1]) {
  //Load main page
  loadStories(db.collection("stories").orderBy("likes", "desc").where("published", "==", true));
} else {
  if (window.location.href.split("?")[1] == "mystories") {
    //Load my stories page
    loadStories(db.collection("stories").where("author", "==", localStorage.name));
  } else if (document.getElementById(window.location.href.split("?")[1] + "-page")) {
    //Display Other Page
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block"
  } else if(window.location.href.split("?")[2]) {
    //Story sub-pages
    if(window.location.href.split("?")[2] == "edit") {
      //Display Edit Page
      hideAllPages();
      db.collection("stories").doc(window.location.href.split("?")[1]).get().then(function(snapshot) {
        if (snapshot.data().author == localStorage.name || snapshot.data.access[firebase.auth().currentUser.uid] == true) {
          document.getElementById("edit-page").style.display = "block";
          document.getElementById("story-title-input").value = snapshot.data().title;
          document.getElementById("story-text-area").innerHTML = snapshot.data().content;
          document.getElementById("tags-input").value = snapshot.data().tags;
          document.getElementById("save-story-btn").onclick = saveStory;
        } else {
          alert("You do not have permission to edit this story.");
        }
      });
      //Insert Tab when the key is pressed
      document.getElementById("story-text-area").onkeydown = function(e) {
        if (e.keyCode == 9) {
          document.execCommand("insertHTML", false, " ");
          return false;
        }
      }
      //Alert the user that changes may not be saved
      window.onbeforeunload = function() {
        return false;
      }
      //Save Story when Ctrl+S is pressed
      document.onkeyup = function(e) {
        if (e.ctrlKey && e.which == 83) {
          saveStory();
        }
      };
    }
  } else {
    //Story page
    db.collection("stories").doc(window.location.href.split("?")[1]).get().then(function(snapshot) {
      if (snapshot.data()) {
        var ValContent = snapshot.data().content;
        var ValTitle = snapshot.data().title;
        document.getElementById("story-page").style.display = "block";
        document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.data().title + "</h1><h5> By " + snapshot.data().author + "</h5></center> <div>" + snapshot.data().content + "</div>";
        
        if (localStorage.name == snapshot.data().author) {
          document.getElementById("story-page").innerHTML += "<button class='btn-primary' id='editBtn' onclick='window.location.href += \"?edit\"' style='right: 5px;'><i class='fas fa-edit'></i></button>";
        }
         if (localStorage.name !== "null" && snapshot.data().title !== "Synco - A Project") {
          document.getElementById("story-page").innerHTML += "<br><br><button class='btn-primary' onclick='likeStory(\"" + window.location.href.split("?")[1] + "\")'><i class='fas fa-thumbs-up'></i> </button> <a class='btn-primary' id='Download' style='right: 5px;' download='" + ValTitle + ".html' href='data:text/plain;charset=utf-8," + ValContent + "'> <i class='fas fa-upload'></i></a>";

        }
      } else {
        document.getElementById("story-404-page").style.display = "block";
      }
       if (snapshot.data().tags !== [""]) {
          for (var i = 0; i < snapshot.data().tags.length; i++) {
            document.getElementById("story-page").innerHTML += "<tag>" + snapshot.data().tags[i] + "</tag>";
          }
        }
    
    });
  }

}
