function getQueryVariable(queryVariable) {
  for(var i = 0; i < window.location.href.replace(window.location.href.split("?")[0] + "?", "").split("&?").length; i++) {
    if(window.location.href.replace(window.location.href.split("?")[0] + "?", "").split("&?")[i].split("=")[0] == queryVariable) {
      return window.location.replace(window.location.href.split("?")[0] + "?", "").split("&?")[i].split("=")[1];
    }
  }
}
