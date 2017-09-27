var express = require("express"),
  router = express.Router(),
  bodyParser = require("body-parser"),
  urlencodedParser = bodyParser.urlencoded({ extended: false }),
  fs = require("fs"),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema;

mongoose.connect('mongodb://fugrammer:efds123password@ds151544.mlab.com:51544/efds_database');
  
var crisisSchema = new Schema({
  crisisID:String,
  status : String
})

var Crisis = mongoose.model('Crisis',crisisSchema);

router.get("/", function(req, res) {
  fs.createReadStream(__dirname + "/../views/updateCMO.html").pipe(res);
});

router.post("/updateCMO", urlencodedParser, function(req, res) {
  console.log(req.body);
  var a = {};
  for (let key of Object.keys(req.body)) {
    if (!req.body[key]) {
      res.writeHead(404);
      res.end();
      return;
    }
  }
  var crisis = Crisis({
    crisisID : req.body.crisisID,
    status : req.body.status
  })
  crisis.save(function(err,dat){
    if (err) console.log ("Failed to save crisis log");
  });
  res.json(require("../../Commons/response").success);
});

module.exports = router;
