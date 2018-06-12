function saveNewFile() {
  firebase.database().ref().push({
    title: document.getElememtById("story-title-input").value,
    author: localStorage.name,
    content: document.getElementById("story-text-area").innerHTML
  });
}
