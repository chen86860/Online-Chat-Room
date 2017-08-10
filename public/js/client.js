
let getCookie = (name) => {
  if (!name || Object.prototype.toString.apply(name) !== '[object String]') return new Error('parm must be a string');
  let cookieArr = {}
  document.cookie && document.cookie.split(';').forEach(e => { e = e.replace(' ', ''); cookieArr[e.split('=')[0]] = e.split('=')[1] })
  return cookieArr[name]
}

var chat = {
  socket: null,
  userId: null,
  userName: null,
  init: function (id) {
    this.userId = this.genUid();
    this.userName = getCookie('username')
    this.socket = io.connect();
    this.socket.emit("login", { id: this.userId, name: this.userName });
    this.socket.on("welcome", function (data) {
      var ul = document.querySelector(".chatBox-ul");
      var li = document.createElement("li");
      li.classList.add("chatRoom-notice");
      li.innerHTML = data.name + " 加入本群";
      ul.appendChild(li);
      chat.scrollToBottom();
    });

    this.socket.on("serverMsg", function (data) {
      chat.insertMsg(data);
    });
    this.socket.on("logout", function (data) {
      var ul = document.querySelector(".chatBox-ul");
      var li = document.createElement("li");
      li.classList.add("chatRoom-notice");
      li.innerHTML = data.name + " 已退出";
      ul.appendChild(li);
      chat.scrollToBottom();
    });
    this.socket.on('updateCount', (data) => {
      document.getElementById('count').innerText = parseInt(data, 10)
    })
  },
  insertMsg: function (obj) {
    var isMe = obj.id === chat.userId ? true : false;
    var ul = document.querySelector(".chatBox-ul");
    if (isMe) {
      var li = document.createElement("li");
      li.classList.add("chatRoom-me");
      li.innerHTML =
        "<div class='chatRoom-user'>" +
        "<img src='" +
        obj.src +
        "'>" +
        "<cite><i>" +
        obj.time +
        "</i>" +
        obj.name +
        "</cite>" +
        "</div>" +
        "<div class='chatRoom-user-text'>" +
        obj.info +
        "</div>";
      ul.appendChild(li);
    } else {
      var li = document.createElement("li");
      li.innerHTML = `
          <div class='chatRoom-user'>
            <img src=${obj.src}>
            <cite>${obj.name}<i>${obj.time}</i></cite>
          </div>
          <div class='chatRoom-user-text'>
            ${obj.info}
            <a href='${obj.cms_url}' class='link'>查看更多</a>
          </div>
         `
      if (obj.cms_url) {
        li.innerHTML = `
         <div class='chatRoom-user'>
            <img src=${obj.src}>
            <cite>${obj.name}<i>${obj.time}</i></cite>
          </div>
          <div class='chatRoom-user-text'>
            ${obj.info}
            <a href='${obj.cms_url}' class='link'>查看更多</a>
          </div>`
      } else {
        li.innerHTML = `
        <div class='chatRoom-user'>
            <img src=${obj.src}>
            <cite>${obj.name}<i>${obj.time}</i></cite>
          </div>
          <div class='chatRoom-user-text'>
            ${obj.info}
          </div>`
      }
      // 增加记录
      ul.appendChild(li);
      // 推广图
      if (obj.img) {
        let li = document.createElement('li')
        li.innerHTML = `
          <div class="chatRoom-user" >
            <img src="${obj.src}" alt="" />
            <cite>${obj.name}<i>${obj.time}</i></cite>
          </div >
          <div class="chatRoom-user-text chatRoom-img">
            <img src="${obj.img + '_400x400q50'}" alt="" />
          </div>`
        ul.appendChild(li)
      }
    }
    chat.scrollToBottom();
  },
  sendMsg: function (info) {
    var info = textarea.value.trim();
    if (info) {
      var msg = {
        id: this.userId,
        info: info,
        time: moment().format("M/D HH:mm:ss")
      };
      this.socket.emit("newMsg", msg);
      textarea.value = "";
      textarea.focus();
    } else {
      return;
    }
  },
  scrollToBottom: function () {
    var sum = 0;
    $(".chatBox-ul li").each((i, e) => {
      sum += $(e).outerHeight();
    });
    $(".chatBox-ul").animate({ scrollTop: sum }, 100);
  },
  genUid: function () {
    return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
  }
};

var roomId = document.getElementById("roomId");
//初始化
chat.init(roomId.value);

// 发送消息
var sendBtn = document.querySelector(".chatBox-btn-send");
var textarea = document.querySelector(".textarea");
sendBtn.addEventListener("click", function () {
  chat.sendMsg();
});
textarea.onkeydown = function (e) {
  var e = e || window.event;
  if (e.keyCode == 13) {
    // 阻止回车换行
    e.cancelBubble = true;
    e.preventDefault();
    e.stopPropagation();
    chat.sendMsg();
  }
};
textarea.focus();

// 获取DOM元素
var chatBox = document.querySelector(".chatBox");
var chatBoxTitle = document.querySelector(".chatBox-title");

// 窗口关闭
var closeBtn = document.querySelector(".chatBox-btn-close");
var closeIcon = document.querySelector(".icon-close");

function chatBoxclose() {
  chat.socket.disconnect(true);
  chatBox.parentNode.removeChild(chatBox);
}

closeIcon.addEventListener("click", chatBoxclose);