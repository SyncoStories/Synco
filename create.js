function saveNewStory() {
  firebase.database().ref().push({
    title: document.getElementById("story-title-input").value,
    author: localStorage.name,
    content: document.getElementById("story-text-area").innerHTML
  });
}
