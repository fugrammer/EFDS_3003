module.exports = function (io) {
  var express = require("express"),
    app = express(),
    router = express.Router(),
    bodyParser = require("body-parser"),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    jsonParser = bodyParser.json({ limit: "500mb" }),
    fs = require("fs");
    // mongoose = require("mongoose"),
    // Schema  = mongoose.Schema;

  // mongoose.connect(
  //   "mongodb://fugrammer:efds123password@ds151544.mlab.com:51544/efds_database"
  // );

  // var crisisSchema = new Schema({
  //   CrisisID: Number,
  //   PlanID: Number,
  //   CrisisType: String,
  //   Lat: Number,
  //   Lon: Number,
  //   Description: String,
  //   SuggestedActions: [{
  //     "DepartmentType": String,
  //     "SeverityRating": String
  //   }
  //   ],
  //   PointOfContact: String
  // }, { versionKey: false });

  // var Crisis = mongoose.model("Crisis", crisisSchema);

  // var updateHQSchema = new Schema({
  //   "Crisis ID": Number,
  //   "Status": String,
  //   "Comments": String
  // }, { versionKey: false });

  // var UpdateDept = mongoose.model("UpdateDept", updateDeptSchema);

  // var squadLocationSchema = new Schema({
  //   Lat : Number,
  //   Lon : Number,
  //   Type : String,
  //   ID: Number
  // }, { versionKey: false });

  // var SquadLocation = mongoose.model("SquadLocation", squadLocationSchema);

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
    UpdateHQ.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/getSquadLocations", function (req, res) {
    SquadLocation.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/initialiseSquadLocations",function (req,res){
    id = 0;
    for (id=0;id<10;id++){
      var squadLocation = SquadLocation({
        Lat : 1.367448,
        Lon : 103.803256,
        Type : "",
        ID: id
      })
      squadLocation.save(function(err,dat){});
    }
  })

  // router.post("/orderDept", [urlencodedParser, jsonParser], function (req, res) {
  //   res.json(require("../../Commons/js/response").success);
  //   var crisis = Crisis({
  //     CrisisID: req.body.CrisisID,
  //     // PlanID: req.body.PlanID,
  //     CrisisType: req.body.CrisisType,
  //     Lat: req.body.Lat,
  //     Lon: req.body.Lon,
  //     Description: req.body.Description,
  //     SuggestedActions: req.body.SuggestedActions,
  //     PointOfContact: req.body.PointOfContact
  //   });
  //   crisis.save(function (err, dat) {
  //     if (err) console.log("Failed to save crisis log");
  //   });
  //   io.emit("ReceiveDeptOrdersController", crisis);
  // });

  router.post("/updateDept", [urlencodedParser, jsonParser], function (req, res) {
    res.json(require("../../Commons/js/response").success);
    var updateDept = UpdateDept({
      "CrisisID": req.body.CrisisID,
      "Status": req.body.Status,
      "Comments": req.body.Comments
    });
    updateDept.save(function (err, dat) {
      if (err) console.log("Failed to save updateHQ log");
    });
    io.emit("ReceiveDepartmentUpdatesController", updateDept);
  });

  // router.post("/updateDept", urlencodedParser, function (req, res) {
  //   console.log(req.body);
  //   var a = {};
  //   for (let key of Object.keys(req.body)) {
  //     if (!req.body[key]) {
  //       res.writeHead(404);
  //       res.end();
  //       return;
  //     }
  //   }
  //
  //   var crisis = Crisis({
  //     crisisID: req.body.crisisID,
  //     status: req.body.status,
  //     description :req.body.description
  //   });
  //
  //   crisis.save(function (err, dat) {
  //     if (err) console.log("Failed to save crisis log");
  //   });
  //
  //   res.json(require("../../Commons/js/response").success);
  // });
  return router;
};
