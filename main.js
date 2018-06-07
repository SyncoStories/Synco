var pageOn = "main";
document.getElementById("main-page").style.display = "block";

function openPage(page) {
  document.getElementById(page + "-page").style.display = "block";
  document.getElementById(pageOn + "-page").style.display = "none";
  pageOn = page;
}
