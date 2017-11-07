var express = require("express"),
  app = express(),
  router = express.Router(),
  port = process.env.PORT || 3000,
  //port = 80,
  http = require('http').Server(app),
  io = require('socket.io')(http),
  mongoose = require("mongoose"),
  Schemas = require("./Commons/backend/Schemas")(mongoose),
  cookieParser = require("cookie-parser"),
  session = require("client-sessions");

// io.set('transports', ['xhr-polling']);
// io.set('polling duration', 10);  
io.set('origins', '*:*');
io.set('match origin protocol', true);

mongoose.connect(
  "mongodb://fugrammer:efds123password@ds151544.mlab.com:51544/efds_database"
);;
app.use(session({
  cookieName: 'session',
  secret: 'rana(*)(!*_sdsakd!@!@!pokd323pokwpoekwpodm23&^@#&*^dom_string_goes_here',
  duration: 10 * 1000,
  activeDuration: 1 * 1000,
}));

app.use(cookieParser());
app.use('/HQ/views', express.static(__dirname + '/HQ/views'));
app.use('/DeptFire/views', express.static(__dirname + '/DeptFire/views'));
app.use('/DeptBomb/views', express.static(__dirname + '/DeptBomb/views'));
app.use('/DeptHazmat/views', express.static(__dirname + '/DeptHazmat/views'));

router.use(express.static("./Commons"))
router.use("/HQ", require("./HQ/backend/HQ")(io,mongoose,Schemas));
router.use("/DeptFire", require("./DeptFire/backend/DeptFire")(io,mongoose,Schemas));
router.use("/DeptBomb", require("./DeptBomb/backend/DeptBomb")(io,mongoose,Schemas));
router.use("/DeptHazmat", require("./DeptHazmat/backend/DeptHazmat")(io,mongoose,Schemas));
router.use("/Squad", require("./Squad/backend/Squad")(io));
router.use("/",require("./Commons/backend/Backend")(io,mongoose,Schemas));
router.use(function(req,res){
  res.end("There's nothing here...");
})

app.use(router);

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});
