var pageOn = "main";
document.getElementById("main-page").style.left = "0";

function openPage(page) {
  document.getElementById(page + "-page").style.left = "0";
  document.getElementById(pageOn + "-page").style.left = "100%";
  pageOn = page;
}
