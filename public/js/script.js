(function() {
  var socket = io.connect('http://188.226.199.141:5003');
  var messages = [];
  var $name    = document.getElementById('name');
  var $message = document.getElementById('message');
  var $button  = document.getElementById('send');
  var $content = document.getElementById('content');
  
  
  socket.on('message', function(data) {
    console.log(data);
    if(data.message) {
      messages.push(data);
      var html = [];
      for(var i = 0; i < messages.length; i++)
        html.push('<b>'+ messages[i].name +'</b>: '+ messages[i].message);
      content.innerHTML = html.join('<br>');
    } else {
      console.log('Problem:', data);
    }
  });
  
  $button.onclick = function(evt) {
    if($name.value == '')
      alert('No name no talking!');
    else {
      $name.disabled = true;
      socket.emit('send', { name: $name.value, message: $message.value });
      $message.value = '';
    }
  }
  
  document.onkeyup = function(evt) {
    if(evt.keyCode == 13)
      $button.click();
  };
  
})();