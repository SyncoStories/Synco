function createNewStory() {
  var newStory = firebase.database().ref().push({
    title: document.getElementById("story-title-input").value,
    author: localStorage.name,
    content: document.getElementById("story-text-area").innerHTML
  });
  window.location.href = "index.html?" + newStory.key;
}

function saveStory() {
  if(window.location.href.split("?")[1]) {
    firebase.database().ref(window.location.href.split("?")[1]).set({
      title: document.getElementById("story-title-input").value,
      author: localStorage.name,
      content: document.getElementById("story-text-area").innerHTML
    });
  }
}
