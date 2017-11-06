var express = require("express"),
  app = express(),
  router = express.Router(),
  port = process.env.PORT || 3000,
  http = require('http').Server(app),
  io = require('socket.io')(http),
  mongoose = require("mongoose"),
  Schemas = require("./Commons/backend/Schemas")(mongoose),
  cookieParser = require("cookie-parser");

mongoose.connect(
  "mongodb://fugrammer:efds123password@ds151544.mlab.com:51544/efds_database"
);;

//app.use(express.static("Commons"));
app.get('/', function (req, res, next) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  if (req.cookies){
    next();
  }
  else {
    res.end("Unauthorized user");
  }
})
app.use(cookieParser());
app.use('/HQ/views', express.static(__dirname + '/HQ/views'));
app.use('/DeptFire/views', express.static(__dirname + '/DeptFire/views'));

router.use(express.static("./Commons"))
router.use("/HQ", require("./HQ/backend/HQ")(io,mongoose,Schemas));
router.use("/DeptFire", require("./DeptFire/backend/DeptFire")(io,mongoose,Schemas));
router.use("/Squad", require("./Squad/backend/Squad")(io));
router.use("/",require("./Commons/backend/Backend")(io,mongoose,Schemas));


// router.get("/", function(req, res) {
//   res.redirect("/HQ");
// });

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
