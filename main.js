var pageOn = "main";
document.getElementById(pageOn + "-page").style.transform = "";

function openPage(page) {
  document.getElementById(page + "-page").style.transform = "";
  document.getElementById(pageOn + "-page").style.transform = "translate(-100%)";
  pageOn = page;
}
