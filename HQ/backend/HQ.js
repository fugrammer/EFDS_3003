module.exports = function (io, mongoose, Schemas) {
  var express = require("express"),
    app = express(),
    router = express.Router(),
    bodyParser = require("body-parser"),
    urlencodedParser = bodyParser.urlencoded({ extended: false }),
    jsonParser = bodyParser.json({ limit: "500mb" }),
    fs = require("fs"),
    Schema = mongoose.Schema;

  router.get("/", function (req, res) {
    var html = fs.readFileSync(__dirname + "/../views/index.html");
    res.end(html);
  });

  /* Provide overall of HQ */
  router.get("/getStatus", function (req, res) {
    var departmentStatus = {}
    Schemas.DepartmentDB.find().lean().exec(function (err, data) {
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
    Schemas.Crisis.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/getPastUpdates", function (req, res) {
    Schemas.UpdateHQ.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/getLocations", function (req, res) {
    Schemas.DepartmentDB.find().lean().exec(function (err, data) {
      result = [];
      for (var _data of data) {
        if (_data.SquadStatus === "Active" || _data.SquadStatus === "On-going") {
          result.push(_data);
        }
      }
      res.json(result);
    });

  });

  /* Order below and receive update from below, and receive order from above and update above */
  router.post("/orderHQ", [urlencodedParser, jsonParser], function (req, res) {
    var crisis = Schemas.Crisis({
      CrisisID: req.body.CrisisID,
      PlanID: req.body.PlanID,
      CrisisType: req.body.CrisisType,
      Lat: req.body.Lat,
      Lon: req.body.Lon,
      Status: req.body.Status,
      Description: req.body.Description,
      SuggestedActions: req.body.SuggestedActions,
      PointOfContact: req.body.PointOfContact
    });

    // var crisisLocation = HQSchemas.DepartmentDB({
    //   Lat: req.body.Lat,
    //   Lon: req.body.Lon,
    //   DepartmentID: "Crisis",
    //   SquadID: req.body.CrisisID.toString(),
    //   CrisisType: req.body.CrisisType,
    //   SquadStatus: req.body.Status
    // });

    newData = {
      Lat: req.body.Lat,
      Lon: req.body.Lon,
      DepartmentID: "Crisis",
      SquadID: req.body.CrisisID.toString(),
      CrisisType: req.body.CrisisType,
      SquadStatus: req.body.Status
    }

    /* Share DB with DepartmentDB lazy */
    /* Change both to update or create */
    var query = { DepartmentID: "Crisis", SquadID: req.body.CrisisID.toString() };
    Schemas.DepartmentDB.findOneAndUpdate(query, newData, { upsert: true }, function (err, doc) {
      if (err) {
        console.log("Failed to save squad update");
      } else {
        console.log("Saved squad update");
      }
    });

    crisis.save(function (err, dat) {
      if (err) console.log("Failed to save crisis log to crisis db");
    });

    io.emit("ReceiveCMOOrder", crisis);
    res.end("success");
  });

  router.post("/updateHQ", [urlencodedParser, jsonParser], function (req, res) {
    res.json(require("../../Commons/js/response").success);
    var updateHQ = Schemas.UpdateHQ({
      "CrisisID": req.body.CrisisID,
      "Status": req.body.Status,
      "Comments": req.body.Comments
    });
    updateHQ.save(function (err, dat) {
      if (err) console.log("Failed to save updateHQ log");
    });
    console.log("Received updateHQ");
    console.log(updateHQ);
    io.emit("deptUpdates", updateHQ);
  });

  router.post("/OrderDept", [urlencodedParser, jsonParser], function (req, res) {
    var host = req.get('host');
    console.log(`Host is ${host}`);
    console.log(JSON.stringify(req.body));
    department = req.body.DepartmentID;
    var request = require('request');
    var json = req.body;
    var options = {
      url: 'localhost:3000/' + department,
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
    res.end("success");
  })

  router.post("/updateCMO", [urlencodedParser, jsonParser], function (req, res) {
    console.log(req.body);
    var a = {};
    for (let key of Object.keys(req.body)) {
      if (!req.body[key]) {
        res.writeHead(404);
        res.end();
        return;
      }
    }
    newData = {
      SquadStatus: req.body.Status
    }
    /* Share DB with DepartmentDB lazy */
    /* Change both to update or create */
    var query = { DepartmentID: "Crisis", SquadID: req.body.CrisisID.toString() };
    Schemas.DepartmentDB.findOneAndUpdate(query, newData, { upsert: true }, function (err, doc) {
      if (err) {
        console.log("Failed to save crisis update");
      } else {
        console.log("Saved crisis update");
      }
    });

    var request = require('request');
    var json = req.body;
    var options = {
      url: 'CMOURL',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      json: json
    };
    // request(options, function (err, res, body) {
    //   if (res && (res.statusCode === 200 || res.statusCode === 201)) {
    //     console.log(body);
    //   }
    // });

    io.emit("UpdateMap");
    res.json(require("../../Commons/js/response").success);
  });


  return router;
};
