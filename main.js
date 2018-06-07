var pageOn = "main";
document.getElementById("main-page").style.transform = "translateX(0)";

function openPage(page) {
  document.getElementById(page + "-page").style.transform = "translateX(0)";
  document.getElementById(pageOn + "-page").style.transform = "translateX(-100%)";
  pageOn = page;
}
