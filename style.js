for (var i = 0; i < document.getElementsByClassName("dropdown").length; i++) {
  document.getElementsByClassName("dropdown")[i].onclick = function() {
    this.getElementsByTagName("ul")[0].style.maxHeight = '100px';
  }
}


window.onclick = function(event) {
  if (!event.target.matches('.toggle-dropdown')) {
    for (var i = 0; i < document.getElementsByClassName("dropdown").length; i++) {
      document.getElementsByClassName("dropdown")[i].getElementsByTagName("ul")[0].style.maxHeight = '0';
    }
  }
}
