document.addEventListener("DOMContentLoaded", function () {
  var messages = document.getElementById('messages');
  var newMsg = document.getElementById('new-msg');
  var userName = document.getElementById('user-name');
  var sendBtn = document.getElementById('btn-send-msg');

  var socket = io();
  socket.on('add-message', function (data) {
    addMessage(data);
  });

  sendBtn.addEventListener('click', function () {
    socket.emit('add-message', {
      name: userName.innerHTML,
      msg: newMsg.value
    });
    newMsg.value = '';
  });

  newMsg.addEventListener('keyup', function(event) {
    event.preventDefault();
      if (event.keyCode === 13) {
        sendBtn.click();
      }
  });

  function addMessage(data) {
    messages.innerHTML += ['<li><strong>', data.name, ':</strong> ', data.msg + '</li>'].join('');
  }

});

// remove an array element.
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

// total number of popups that can be displayed according to viewport width
var total_popups = 0;

// arrays of popups ids
var popups = [];

// close a popup
function close_popup(id)
{
  for(var iii = 0; iii < popups.length; iii++)
  {
      if(id == popups[iii])
      {
          Array.remove(popups, iii);
          
          document.getElementById(id).style.display = "none";
          
          calculate_popups();
          
          return;
      }
  }   
}

// displays the popups based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
  var right = 220;
  
  var iii = 0;
  for(iii; iii < total_popups; iii++)
  {
      if(popups[iii] != undefined)
      {
          var element = document.getElementById(popups[iii]);
          element.style.right = right + "px";
          right = right + 320;
          element.style.display = "block";
      }
  }
  
  for(var jjj = iii; jjj < popups.length; jjj++)
  {
      var element = document.getElementById(popups[jjj]);
      element.style.display = "none";
  }
}

// creates markup for a new popup, adds the id to popups array
function register_popup(id, name)
{
  
  for(var iii = 0; iii < popups.length; iii++)
  {   
      // already registered, bring it to front
      if(id == popups[iii])
      {
          Array.remove(popups, iii);
      
          popups.unshift(id);
          
          calculate_popups();
          
          
          return;
      }
  }               
  
  var element = '<div class="popup-box chat-popup" id="'+ id +'">';
  element = element + '<div class="popup-head">';
  element = element + '<div class="popup-head-left">'+ name +'</div>';
  element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
  element = element + '<div style="clear: both"></div></div><div class="popup-messages"><ul id="messages"></ul><br><br><textarea id="new-msg" placeholder="Type your message."></textarea><br><br><input type="button" id="btn-send-msg" value=" Send Message "></div></div>';
  
  document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;

  popups.unshift(id);
          
  calculate_popups();
  
}

// calculate the total number of popups suitable, then populate the total_popups variable
function calculate_popups() {
  var width = window.innerWidth;
  if(width < 540)
  {
      total_popups = 0;
  }
  else
  {
      width = width - 200;
      // 320 is width of a single popup box
      total_popups = parseInt(width/320);
  }
  
  display_popups();
  
}

// recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);
