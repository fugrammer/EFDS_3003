module.exports = function (io,mongoose,Schemas) {
  var express = require("express"),
    app = express(),
    router = express.Router(),
    bodyParser = require("body-parser"),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    jsonParser = bodyParser.json({ limit: "500mb" }),
    fs = require("fs"),
    Schema = mongoose.Schema;
    // Schemas = require("./Schemas");

  router.get("/", function (req, res) {
    var html = fs.readFileSync(__dirname + "/../views/index.html");
    res.end(html);
  });

  /* Provide overall of DeptFire */
  router.get("/getStatus", function (req, res) {
    var departmentStatus = {}
    var filter = {"DepartmentID":"Fire"};
    Schemas.DepartmentDB.find(filter).lean().exec(function (err, data) {
      for (var _data of data) {
        departmentStatus[_data.DepartmentID] = departmentStatus[_data.DepartmentID] || { max: 0, available: 0 };
        departmentStatus[_data.DepartmentID].max += 1;
        if (_data.SquadStatus === "Available")
          departmentStatus[_data.DepartmentID].available += 1;
      }
      res.json(departmentStatus);
    });

  })

  /* When app first loaded */
  router.get("/getPastOrders", function (req, res) {
    var filter = {DepartmentID:"DeptFire"}
    Schemas.DepartmentOrder.find(filter).lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/getPastUpdates", function (req, res) {
    var filter = {DepartmentID:"DeptFire"}
    Schemas.UpdateDept.find(filter).lean().exec(function (err, data) {
      res.json(data);
    });
  });
  /* TO DO */
  /* Order below and receive update from below, and receive order from above and update above */
  router.post("/orderDept", [urlencodedParser, jsonParser], function (req, res) {
    var departmentOrder = new Schema({
      DepartmentID: req.body.DepartmentID,
      NumberOfSquads: req.body.NumberOfSquads,
      Lat: req.body.Lat,
      Lon: Numbereq.body.Lon,
      CrisisID: Numbereq.body.CrisisID,
      Severity: req.body.Severity,
      Comments: req.body.Comments
    });
    departmentOrder.save(function (err, dat) {
      if (err) console.log("Failed to save department order log to department db");
    });

    io.emit("ReceiveHQOrder", departmentOrder);
    res.end("success");
  });

  router.post("/OrderSquad",[urlencodedParser, jsonParser],function(req,res){
    var host = req.get('host');
    console.log(`Host is ${host}`);
    console.log(JSON.stringify(req.body));
    department = req.body.DepartmentID;
    squad = req.body.SquadID;
    var request=require('request');
       var json = req.body;
       var options = {
         url: 'localhost:3000/'+department+"/"+squad,
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         json: json
       };
       request(options, function(err, res, body) {
         if (res && (res.statusCode === 200 || res.statusCode === 201)) {
           console.log(body);
         }
       });
  })

  router.post("/updateDept", [urlencodedParser, jsonParser], function (req, res) {
    res.json(require("../../Commons/js/response").success);
    var updateDept = Schemas.UpdateDept({
      "DepartmentID":req.body.DepartmentID,
      "SquadID":req.body.SquadID,
      "Lat":req.body.Lat,
      "Lon":req.body.Lon,
      "CrisisID": req.body.CrisisID,
      "Status": req.body.Status,
      "Comments": req.body.Comments
    });

    newData = {
      Lat: req.body.Lat,
      Lon: req.body.Lon,
      SquadStatus: req.body.Status
    }

    /* Share DB with DepartmentDB lazy */
    /* Change both to update or create */
    var query = { DepartmentID: req.body.DepartmentID, SquadID:req.body.SquadID};
    Schemas.DepartmentDB.findOneAndUpdate(query, newData, { upsert: true }, function (err, doc) {
      if (err) {
        console.log("Failed to save squad update");
      } else {
        console.log("Saved squad update");
      }
    });

    updateDept.save(function (err, dat) {
      if (err) console.log("Failed to save updateHQ log");
    });

    io.emit("ReceiveSquadUpdates", updateDept);
  });

  router.post("/updateHQ", urlencodedParser, function (req, res) {
    console.log(req.body);
    var a = {};
    for (let key of Object.keys(req.body)) {
      if (!req.body[key]) {
        res.writeHead(404);
        res.end();
        return;
      }
    }
    var request = require('request');
    var json = req.body;
    var options = {
      url: 'localhost:3000/updateHQ',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      json: json
    };
    request(options, function (err, res, body) {
      if (res && (res.statusCode === 200 || res.statusCode === 201)) {
        console.log(body);
      }
    });
    res.json(require("../../Commons/js/response").success);
  });
  return router;
};
