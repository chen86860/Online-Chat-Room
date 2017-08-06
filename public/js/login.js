(function() {
  var getDom = function(selector) {
    return document.getElementById(selector);
  };
  var login = function() {
    if (!document.querySelector("#userName").value) return;
    var userName = getDom("userName").value;
    window.name = userName;
    window.location = "chat";
  };
  getDom("login").addEventListener("click", login);
  getDom("userName").onkeydown = function(e) {
    e = e || window.event;
    if (e.keyCode === 13) {
      login();
    }
  };
})();
