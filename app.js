var express = require("express"),
  app = express(),
  router = express.Router(),
  port = process.env.PORT || 3000,
  http = require('http').Server(app),
  io = require('socket.io')(http);

//app.use(express.static("Commons"));
app.use('/HQ/views', express.static(__dirname + '/HQ/views'));

router.use(express.static("./Commons"))

router.use("/HQ", require("./HQ/backend/HQ")(io));
router.use("/Department_Fire", require("./Department_Fire/backend/DeptFire")(io));

router.get("/", function(req, res) {
  res.redirect("/HQ");
});

router.get("/addMessage", function(req, res) {
  //io.emit('executiveorder', "hello");
  res.end("done");
});

app.use(router);

io.on('connection', function(socket){
  console.log('a user connected');
  //socket.emit('executiveorder',"hello");
  // socket.on('chat message', function(msg){
  //     messagehistory.push(msg);
  //     io.emit('chat message', msg);
  // });
});


http.listen(port, function(){
  console.log('listening on *:'+port);
});
// app.listen(port, function() {
//   console.log(`Listening on port ${port}...`);
// });
