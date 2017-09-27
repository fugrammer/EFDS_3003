var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/io.html');
});

app.get('/addMessage', function(req, res){
  io.emit('chat message',"message added");
  console.log(req.connection.remoteAddress);
  res.send("done!");
});

var messagehistory = []

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('initialise',messagehistory);
  socket.on('chat message', function(msg){
      messagehistory.push(msg);
      io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});