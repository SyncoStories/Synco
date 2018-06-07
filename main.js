var pageOn = "home";

for(var i = 0; i < document.getElementsByClassName("page").length; i++) {
  document.getElementsByClassName("page")[i].style.transform = "translate(100%)";
}

function openPage(page) {
  document.getElementById(page + "-page").style.transform = "";
  document.getElementById(pageOn + "-page").style.transform = "translate(-100%)";
  pageOn = page;
}
