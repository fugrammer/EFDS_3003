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
    Schemas.DepartmentOrder.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/getPastUpdates", function (req, res) {
    Schemas.UpdateDept.find().lean().exec(function (err, data) {
      res.json(data);
    });
  });
  /* TO DO */
  /* Order below and receive update from below, and receive order from above and update above */
  router.post("/orderDept", [urlencodedParser, jsonParser], function (req, res) {
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

    // var crisisLocation = Schemas.DepartmentDB({
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

  router.post("/updateDept", [urlencodedParser, jsonParser], function (req, res) {
    res.json(require("../../Commons/js/response").success);
    var updateDept = Schemas.UpdateDept({
      "CrisisID": req.body.CrisisID,
      "Status": req.body.Status,
      "Comments": req.body.Comments
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

    var crisis = Schemas.Crisis({
      crisisID: req.body.crisisID,
      status: req.body.status,
      description: req.body.description
    });

    crisis.save(function (err, dat) {
      if (err) console.log("Failed to save crisis log");
    });

    res.json(require("../../Commons/js/response").success);
  });
  return router;
};
