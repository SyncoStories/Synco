for (var i = 0; i < document.getElementsByClassName("dropdown").length; i++) {
  document.getElementsByClassName("dropdown")[i].onclick = function() {
    this.getElementsByTagName("ul")[0].style.maxHeight = '100px';
  }
}

document.addEventListener("DOMNodeInserted", function(e) {
  if(e.target.className == 'dropdown') {
    e.target.onclick = function() {
      this.getElementsByTagName("ul")[0].style.maxHeight = '100px';
    }
  }
});

window.onclick = function(event) {
  if (!event.target.matches('.toggle-dropdown')) {
    for (var i = 0; i < document.getElementsByClassName("dropdown").length; i++) {
      document.getElementsByClassName("dropdown")[i].getElementsByTagName("ul")[0].style.maxHeight = '0';
    }
  }
}

function searchbarSearch() {
	var searchbar = document.getElementById('nav-search');
  alert(searchbar.value);
  if (searchbar.value !== '') {
    searchStories(searchbar.value);
    searchbar.style.width = '50%';
  } else {
    window.location.href = 'index.html'
  }
  if(document.getElementsByClassName('navbar')[0].style.height == '100%') {
  	document.getElementsByClassName('navbar')[0].style.height = '10%';
    alert('ti');
  }
}
