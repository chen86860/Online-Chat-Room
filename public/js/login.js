(function () {
  var getDom = function (selector) {
    return document.getElementById(selector);
  };
  var login = function () {
    if (!document.querySelector("#userName").value) return;
    var userName = getDom("userName").value;
    window.document.cookie = `username=${userName};path=/;domain=${window.location.hostname}`
    window.location = "./chat/" + Math.ceil(new Date().getTime() / 1000000)
  };
  getDom("login").addEventListener("click", login);
  getDom("userName").onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode === 13) {
      login();
    }
  };
})();
