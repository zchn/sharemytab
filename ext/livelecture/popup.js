window.baseUrl = 'http://www.cs.berkeley.edu/~kevinchn/sharemt/';

window.onload=function(){
  updateButton();
  var button = document.getElementById('broadcastme');
  button.onclick = function(){
    var bgpage = chrome.extension.getBackgroundPage();
    bgpage.toggle();
    updateButton();
  };
};

function updateButton(){
    var button = document.getElementById('broadcastme');
    var urldiv = document.getElementById('listenurldiv');
    var bgpage = chrome.extension.getBackgroundPage();
    console.log(bgpage.isBroadcasting());
    console.log(button);
    if(bgpage.isBroadcasting()){
      button.innerText = 'Stop Broadcasting';
      var hash=bgpage.getRoomName();
      urldiv.innerHTML='<a href="'+baseUrl+'#'+hash+'" >'+baseUrl+'#'+hash+'</a>';
    }else{
      button.innerText = "Broadcast!";
      urldiv.innerHTML='';
    }
}

