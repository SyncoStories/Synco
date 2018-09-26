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

function createNewStory() {
  var newStory = firebase.database().ref().child("stories").push({
    title: document.getElementById("story-title-input").value,
    author: localStorage.name,
    uid: firebase.auth().currentUser.uid,
    content: document.getElementById("story-text-area").innerHTML,
    tags: document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').slice(0, document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').length - 1),
    public: {
      likes: 0,
    }
  });
  window.location.href = "?" + newStory.key;
}

function saveStory() {
  if (window.location.href.split("?")[1]) {
    var storyRef = firebase.database().ref("stories/" + window.location.href.split("?")[1]);
    storyRef.child("title").set(document.getElementById("story-title-input").value);
    storyRef.child("author").set(localStorage.name);
    storyRef.child("content").set(document.getElementById("story-text-area").innerHTML);
    storyRef.child("tags").set(document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').slice(0, document.getElementById("tags").innerHTML.replace(/<tag onclick="this.parentElement.removeChild\(this\)">/g, '').split('</tag>').length - 1));
    document.location.reload();
  }
}

function rateStory(storyId, starRating, rating, uid, displayName) {
    firebase.database().ref('stories/' + uid + '/public/ratings/' + uid).set({starRating: starRating, rating: rating, displayName: displayName});
}

function getStoryInfo(storyId) {
  var toReturn;
  firebase.database().ref("stories/" + storyId).once("value", function(snapshot) {
    toReturn = snapshot.val();
  });
  return toReturn;
}

function deleteStory(storyId) {
  firebase.database().ref("stories/" + storyId).remove().then(function() {
    alert("The story has been sucessfully deleted!");
  }).catch(function(error) {
    alert(error);
  })
}

function likeStory(storyId) {
  firebase.database().ref("stories/" + storyId + "/public/likes").transaction(function(likes) {
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
    var stories = new Fuse(Object.keys(snapshot.val()).map(function(key) {return {data: snapshot.val()[key], key: key}}), options).search(search);
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

function editStory(storyId) {
  hideAllPages();
  firebase.database().ref("stories/" + storyId).once("value", function(snapshot) {
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
    }
  });
  document.getElementById("story-text-area").onkeydown = function(e) {
    if(e.keyCode == 9) {
      document.execCommand("insertHTML", false, " ");
      return false;
    }
  }
}

hideAllPages();
if (!window.location.href.split("?")[1]) {
  document.getElementById("main-page").style.display = "block";
  firebase.database().ref("stories").orderByChild("public/likes").once("value", function(snapshot) {
    document.getElementById('story-cards').innerHTML = '';
    snapshot.forEach(function(storySnapshot) {
      if (storySnapshot.val().public.likes == -1) {
        var likeLikes = "Like"
      } else {
        var likeLikes = "Likes"
      }
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'index.html?' + storySnapshot.key + '\'"><font class="card-title">' + storySnapshot.val().title + '</font><p><i class="fas fa-address-card"></i> ' + storySnapshot.val().author + ' </p><p>' + storySnapshot.val().public.likes * -1 + ' <i class="fas fa-thumbs-up"></i></p></span>';
    });
  });
} else {
  if (document.getElementById(window.location.href.split("?")[1] + "-page")) {
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block"
  } else {
    firebase.database().ref("stories/" + window.location.href.split("?")[1]).once("value", function(snapshot) {
      if (snapshot.val()) {
          document.getElementById("story-page").style.display = "block";
          document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.val().title + "</h1><h5> By " + snapshot.val().author + "</h5></center><div>" + snapshot.val().content + "</div>";
          if (snapshot.val().tags) {
            for (var i = 0; i < snapshot.val().tags.length; i++) {
              document.getElementById("story-page").innerHTML += "<tag>" + snapshot.val().tags[i] + "</tag>";
            }
          }
          if (localStorage.name !== "null") {
            document.getElementById("story-page").innerHTML += "<br><br><button class='btn-primary' onclick='likeStory(\"" + window.location.href.split("?")[1] + "\")'><i class='fas fa-thumbs-up'></i>";
          }
          if(localStorage.name == snapshot.val().author) {
            document.getElementById("story-page").innerHTML += "<button class='btn-primary' onclick='editStory(\"" + window.location.href.split("?")[1] + "\")' style='right: 5px;'><i class='fas fa-edit'></i></button>";
          }
      } else {
        document.getElementById("story-404-page").style.display = "block";
      }
    });
  }
}
