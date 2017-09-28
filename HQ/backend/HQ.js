module.exports = function(io) {
  var express = require("express"),
    app = express(),
    router = express.Router(),
    bodyParser = require("body-parser"),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    jsonParser = bodyParser.json({ limit: "500mb" }),
    fs = require("fs"),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema;

  mongoose.connect(
    "mongodb://fugrammer:efds123password@ds151544.mlab.com:51544/efds_database"
  );

  var crisisSchema = new Schema({
    crisisID: String,
    status: String,
    threatLevel: String
  }, { versionKey: false});

  var Crisis = mongoose.model("Crisis", crisisSchema);

  router.get("/", function(req, res) {
    var html = fs.readFileSync(__dirname + "/../views/index.html");
    res.end(html);
  });

  router.get("/getPastOrders", function(req, res) {
    Crisis.find().lean().exec(function(err, data) {
      res.json(data);
    });
  });

  router.post("/orderHQ", [urlencodedParser, jsonParser], function(req, res) {
    res.json(require("../../Commons/js/response").success);
    var crisis = Crisis({
      crisisID: req.body.crisisID,
      status: req.body.status,
      threatLevel: req.body.threatLevel
    });
    crisis.save(function(err, dat) {
      if (err) console.log("Failed to save crisis log");
    });
    io.emit("executiveorder", crisis);
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
      crisisID: req.body.crisisID,
      status: req.body.status
    });
    crisis.save(function(err, dat) {
      if (err) console.log("Failed to save crisis log");
    });
    res.json(require("../../Commons/js/response").success);
  });
  return router;
};
