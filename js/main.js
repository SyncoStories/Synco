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

var queryVariable = window.location.href.split('?')[1];

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
  db.collection('stories').where('public', '==', true).get(function(snapshot) {
     var stories = new Fuse(Object.keys(snapshot.val()).map(function(key) {return {data: snapshot.val()[key], key: key}}), options).search(search);
     if(stories.length == 0) {
       document.getElementById('story-cards').innerHTML = '<br><br><h4 style="color: lightgray">No Stories Matched Your Search</h4>';
     } else {
       document.getElementById('story-cards').innerHTML = '';
     }
      document.getElementById('story-cards').innerHTML += '<span class="card" onclick="window.location.href = \'index.html?' + stories[i].key + '\'"><font class="card-title">' + stories[i].data.title + '</font><p>By ' + stories[i].data.author + ' </p><p>' + stories[i].data.public.likes * -1 + ' ' + likeLikes + '</p></span>';
    }
  });
}

hideAllPages();
if(queryVariable) {
 if(document.getElementById(queryVariable + "-page")) {
   document.getElementById(queryVariable + "-page").style.display = 'block';
 } else {
   
 }
} else {
  
}
