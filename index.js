var express = require('express');
var path    = require('path');
var http    = require('http');
var app     = express();

app.configure(function() {
  app.set('port', 5003);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function() {
  app.use(express.errorHandler());
});


app.get('/', function(req, res) {
  res.render('index');
});


var io = require('socket.io').listen(app.listen(app.get('port')));
var mongoose = require('mongoose').connect('mongodb://localhost/chat');
var db = mongoose.connection;

var Message;

db.on('error', console.error.bind(console, 'console error: '));
db.once('open', function() {
  console.log('MongoDB:connected');
  var schema = mongoose.Schema({
    name   : String,
    message: String,
    created: Date,
    read   : Number
  });
  
  Message = mongoose.model('Message', schema);
});


io.sockets.on('connection', function (socket) {
  Message.find({ read: 0 }, function(err, messages) {
    for(var i in messages)
      socket.emit('message', { name: messages[i].name, message: messages[i].message });
  });
  
  socket.on('send', function (data) {
    var message = new Message({ name: data.name, message: data.message, created: new Date(), read: 1 });
    message.save(function(err, message) {
      if(err)
        console.error(err);
    });
    io.sockets.emit('message', data);
  });
});