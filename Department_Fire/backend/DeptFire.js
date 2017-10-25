module.exports = function (io) {
  var express = require("express"),
    app = express(),
    router = express.Router(),
    bodyParser = require("body-parser"),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    jsonParser = bodyParser.json({ limit: "500mb" }),
    fs = require("fs"),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    HQSchemas = require("./HQSchemas");

  mongoose.connect(
    "mongodb://fugrammer:efds123password@ds151544.mlab.com:51544/efds_database"
  );

  router.get("/", function (req, res) {
    var html = fs.readFileSync(__dirname + "/../views/index.html");
    res.end(html);
  });

  router.get("/getPastOrders", function (req, res) {
    Crisis.find().lean().exec(function (err, data) {
      res.json(data);
    }); 
  });

  router.get("/getPastUpdates", function (req, res) {
    HQSchemas.UpdateHQ.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/getSquadLocations", function (req, res) {
    HQSchemas.SquadLocation.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/initialiseSquadLocations",function (req,res){
    id = 0;
    for (id=0;id<10;id++){
      var squadLocation = HQSchemas.SquadLocation({
        Lat : 1.367448,
        Lon : 103.803256,
        Type : "",
        ID: id.toString()
      })
      squadLocation.save(function(err,dat){});
    }
    res.end("success");
  })

  router.post("/orderHQ", [urlencodedParser, jsonParser], function (req, res) {
    var crisis = HQSchemas.Crisis({
      CrisisID: req.body.CrisisID,
      PlanID: req.body.PlanID,
      CrisisType: req.body.CrisisType,
      Lat: req.body.Lat,
      Lon: req.body.Lon,
      Status: req.body.Status | "On-going",
      Description: req.body.Description,
      SuggestedActions: req.body.SuggestedActions,
      PointOfContact: req.body.PointOfContact
    });
    crisis.save(function (err, dat) {
      if (err) console.log("Failed to save crisis log");
    });
    io.emit("ReceiveCMOOrder", crisis);
    res.end("success");
  });

  router.post("/updateHQ", [urlencodedParser, jsonParser], function (req, res) {
    res.json(require("../../Commons/js/response").success);
    var updateHQ = HQSchemas.UpdateHQ({
      "CrisisID": req.body.CrisisID,
      "Status": req.body.Status,
      "Comments": req.body.Comments
    });
    updateHQ.save(function (err, dat) {
      if (err) console.log("Failed to save updateHQ log");
    });
    io.emit("ReceiveDepartmentUpdates", updateHQ);
  });

  router.post("/updateCMO", urlencodedParser, function (req, res) {
    console.log(req.body);
    var a = {};
    for (let key of Object.keys(req.body)) {
      if (!req.body[key]) {
        res.writeHead(404);
        res.end();
        return;
      }
    }

    var crisis = HQSchemas.Crisis({
      crisisID: req.body.crisisID,
      status: req.body.status,
      description :req.body.description
    });

    crisis.save(function (err, dat) {
      if (err) console.log("Failed to save crisis log");
    });

    res.json(require("../../Commons/js/response").success);
  });
  return router;
};
