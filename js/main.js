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
  var newStory = db.collection('stories').add({
    title: document.getElementById("story-title-input").value,
    author: localStorage.name,
    uid: firebase.auth().currentUser.uid,
    content: document.getElementById("story-text-area").innerHTML
  });
  window.location.href = "?" + newStory.key;
}

function saveStory() {
  if (window.location.href.split("?")[1]) {
    db.collection('stories').doc(window.location.href.split("?")[1]).update({
      title: document.getElementById("story-title-input").value,
      author: user.email.replace('@fakeemail.com', ''),
      content: document.getElementById("story-text-area").innerHTML
    }).then(function() {
      console.log('Done Saving');
    }).catch(function(error) {
      throw error;
      alert(error);
    });
  }
}

function deleteStory(storyId) {
  db.collection('stories').doc(storyId).remove().then(function() {
    alert("The story has been sucessfully deleted!");
  }).catch(function(error) {
    alert(error);
  });
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
  db.collection('stories').get(function(snapshot) {
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
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'index.html?' + stories[i].key + '\'"><font class="card-title">' + stories[i].data.title + '</font><p>By ' + stories[i].data.author + ' </p><p>' + stories[i].data.public.likes * -1 + ' ' + likeLikes + '</p></span>';
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
} else {
  if (document.getElementById(window.location.href.split("?")[1] + "-page")) {
    document.getElementById(window.location.href.split("?")[1] + "-page").style.display = "block"
  } else {
    db.collection('stories').doc(window.location.href.split('?')[1]).get(function(snapshot) {
      if (snapshot.val()) {
          document.getElementById("story-page").style.display = "block";
          document.getElementById("story-page").innerHTML = "<center><h1>" + snapshot.data().title + "</h1><h5> By " + snapshot.data().author + "</h5></center><div>" + snapshot.data().content + "</div>";
          if(localStorage.name == snapshot.val().author) {
            document.getElementById("story-page").innerHTML += "<button class='btn-primary round-hover' onclick='editStory(\"" + window.location.href.split("?")[1] + "\")' style='right: 5px;'><div class='pencil-icon'><i></i></div></button>";
          }
      } else {
        document.getElementById("story-404-page").style.display = "block";
      }
    });
  }
}
