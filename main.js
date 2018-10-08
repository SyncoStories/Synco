//defining default search options
var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    "data.title",
    "data.author",
    "data.tags"
]
};

function editStory(storyId) {
  hideAllPages();
  db.collection("stories").doc(storyId).get().then(function(snapshot) {
    if (snapshot.data().author == localStorage.name) {
          document.getElementById("edit-page").style.display = "block";
          document.getElementById("story-title-input").value = snapshot.data().title;
          document.getElementById("story-text-area").innerHTML = snapshot.data().content;
          document.getElementById("tags").innerHTML = "";
          if (snapshot.data().tags) {
            for (var i = 0; i < snapshot.val().tags.length; i++) {
              document.getElementById("tags").innerHTML += '<tag onclick="this.parentElement.removeChild(this)">' + snapshot.data().tags[i] + '</tag>';
            }
         }
       document.getElementById("save-story-btn").onclick = saveStory;
    }
  });
  document.getElementById("story-text-area").onkeydown = function(e) {
    if(e.keyCode == 9) {
      document.execCommand("insertHTML", false, " ");
      return false;
    }
  }
}



function createNewStory() {
  db.collection("stories").add({
    title: prompt("", "Untitled Story"),
    author: localStorage.name,
    uid: firebase.auth().currentUser.uid,
    content: "",
    tags: [],
    public: {
      likes: 0,
    }
  }).then(function(docRef) {
    window.location.href = "?" + docRef.id;
  }).catch(function(error) {
    alert(error);
    throw error;
  });
}

function saveStory() {
  if (window.location.href.split("?")[1]) {
    db.collection("stories").doc(window.location.href.split("?")[1]).update({
      title: document.getElementById("story-title-input").value,
      author: localStorage.name
      ,
      content: document.getElementById("story-text-area").innerHTML,
      tags: document.getElementById("tags").innerHTML.split(",")
    });
    document.location.reload();
  }
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
  if(confirm("Are you sure that you would like to delete this story? All data will be permanently lost.")) {
    db.collection("stories").doc(storyId).delete().then(function() {
      alert("The story has been successfully deleted!");
    }).catch(function(error) {
      alert(error);
    });
  }
}

function hideAllPages() {
  for (var i = 0; i < document.getElementsByClassName("page").length; i++) {
    document.getElementsByClassName("page")[i].style.display = "none";
  }
}

function searchStories(search) {
  hideAllPages();
  document.getElementById('main-page').style.display = 'block';
  document.getElementById('story-cards').innerHTML = '<br><br><h4 style="color: lightgray">Loading . . .</h4>';
  firebase.database().ref("stories").once("value",function(snapshot) {
    var stories = new Fuse(Object.keys(snapshot.data()).map(function(key) {return {data: snapshot.data()[key], key: key}}), options).search(search);
    if(stories.length == 0) {
      document.getElementById('story-cards').innerHTML = '<br><br><h4 style="color: lightgray">No Stories Matched Your Search</h4>';
    } else {
      document.getElementById('story-cards').innerHTML = '';
    }
    for(var i = 0; i < stories.length; i++) {
      if (stories[i].data.public.likes == -1) {
        var likeLikes = "Like"
      } else {
        var likeLikes = "Likes"
      }
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'index.html?' + stories[i].key + '\'"><font class="card-title">' + stories[i].data.title + '</font><p>By ' + stories[i].data.author + ' </p><p>' + stories[i].data.public.likes * -1 + ' <i class="fas fa-thumbs-up"></i></p></span>';
    }
  })
}


hideAllPages();
if (!window.location.href.split("?")[1]) {
  document.getElementById("main-page").style.display = "block";
  db.collection("stories").get().then(function(snapshot) {
    document.getElementById('story-cards').innerHTML = '';
    snapshot.forEach(function(storySnapshot) {
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'https://synco.tk/?' + storySnapshot.id + '\'"><font class="card-title">' + storySnapshot.data().title + '</font><p><i class="fas fa-address-card"></i> ' + storySnapshot.data().author + ' </p><p><i class="fas fa-thumbs-up"></i> ' + storySnapshot.data().public.likes * -1 + '</p></span>';
    });
  });
} else {
  if (document.getElementById(window.location.href.split("?")[1] + "-page")) {
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block"
  } else {
    db.collection("stories").doc(window.location.href.split("?")[1]).get().then(function(snapshot) {
      if (snapshot.data()) {
          var ValContent = snapshot.data().content;
          var ValTitle = snapshot.data().title;
          document.getElementById("story-page").style.display = "block";
          document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.data().title + "</h1><h5> By " + snapshot.data().author + "</h5></center><div>" + snapshot.data().content + "</div>";
          if (snapshot.data().tags) {
            for (var i = 0; i < snapshot.data().tags.length; i++) {
              document.getElementById("story-page").innerHTML += "<tag>" + snapshot.data().tags[i] + "</tag>";
            }
          }
          if (localStorage.name !== "null" && snapshot.data().title !== "Synco: A Work in Progress") {
            document.getElementById("story-page").innerHTML += "<br><br><button class='btn-primary' onclick='likeStory(\"" + window.location.href.split("?")[1] + "\")'><i class='fas fa-thumbs-up'></i> </button> <a class='btn-primary' id='Download' style='right: 5px;' download='" + ValTitle + ".html' href='data:text/plain;charset=utf-8," + ValContent + "'> <i class='fas fa-upload'></i></a>";

          }
          if(localStorage.name == snapshot.data().author) {
            document.getElementById("story-page").innerHTML += "<button class='btn-primary' id='editBtn' onclick='editStory(\"" + window.location.href.split("?")[1] + "\")' style='right: 5px;'><i class='fas fa-edit'></i></button>";          
          }
      } else {
        document.getElementById("story-404-page").style.display = "block";
      }
    });
  }
 
}

