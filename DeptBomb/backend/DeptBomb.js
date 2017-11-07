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
    if (!(req.cookies.tokenBomb === "powerBomb")) {
      console.log("no cookie found!");
      res.redirect("/login?redirect=/DeptBomb");
    }
    else {
      console.log("cookie accepted!");
      var html = fs.readFileSync(__dirname + "/../views/index.html");
      res.end(html);
    }
  });

  /* Provide overall of DeptFire */
  router.get("/getStatus", function (req, res) {
    var departmentStatus = {}
    var filter = {"DepartmentID":"Bomb"};
    Schemas.DepartmentDB.find(filter).lean().exec(function (err, data) {
      for (var _data of data) {
        departmentStatus[_data.SquadID] = _data.SquadStatus;
        //departmentStatus[_data.SquadID].status = departmentStatus[_data.SquadID];
        // departmentStatus[_data.DepartmentID].max += 1;
        // if (_data.SquadStatus === "Available")
        //   departmentStatus[_data.DepartmentID].available += 1;
      }
      res.json(departmentStatus);
    });

  })

  /* When app first loaded */
  router.get("/getPastOrders", function (req, res) {
    var filter = {DepartmentID:"DeptBomb"}
    Schemas.DepartmentOrder.find(filter).lean().exec(function (err, data) {
      res.json(data);
    });
  });

  router.get("/getPastUpdates", function (req, res) {
    var filter = {DepartmentID:"DeptBomb"}
    Schemas.UpdateDept.find(filter).lean().exec(function (err, data) {
      res.json(data);
    });
  });
  /* TO DO */
  /* Order below and receive update from below, and receive order from above and update above */
  router.post("/OrderDept", [urlencodedParser, jsonParser], function (req, res) {
    var departmentOrder = Schemas.DepartmentOrder({
      DepartmentID: req.body.DepartmentID,
      NumberOfSquads: req.body.NumberOfSquads,
      Lat: req.body.Lat,
      Lon: req.body.Lon,
      CrisisID: req.body.CrisisID,
      Severity: req.body.Severity,
      Comments: req.body.Comments
    });

    departmentOrder.save(function (err, dat) {
      if (err) console.log("Failed to save departmentBomb order log to department db");
    });
    console.log("bomb ReceiveHQOrder");
    console.log(departmentOrder); 
    io.emit("BombReceiveHQOrder", departmentOrder);
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
         url: `http://${host}/`+department+"/"+squad,
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         json: json
       };
       request(options, function(err, res, body) {
         if (res && (res.statusCode === 200 || res.statusCode === 201)) {
            console.log("Order squad success");
           console.log(body);
         }else{
           console.log("order squad failed")
         }
       });
       res.end("success");
  })

  router.post("/updateDept", [urlencodedParser, jsonParser], function (req, res) {
    
    var updateDept = Schemas.UpdateDept({
      "DepartmentID":req.body.DepartmentID,
      "SquadID":req.body.SquadID,
      "CrisisID": req.body.CrisisID,
      "Status": req.body.Status,
      "Comments": req.body.Comments
    });

    console.log("update dept with: ");
    console.log(updateDept);
    newData = {
      Lat: req.body.Lat,
      Lon: req.body.Lon,
      SquadStatus: req.body.Status
    }
    /* Share DB with DepartmentDB lazy */
    /* Change both to update or create */
    var query = { DepartmentID: req.body.DepartmentID.replace("Dept",""), SquadID:req.body.SquadID}; 
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
    io.emit("ReceiveBombSquadUpdates", updateDept);
    io.emit("UpdateMap",null);
    res.json(require("../../Commons/js/response").success);
  });

  router.post("/updateHQ", urlencodedParser, function (req, res) {
    console.log("updateHQ");
    console.log(req.body);
    var host = req.get('host');
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
      url: `http://${host}/HQ/updateHQ`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    };
    request(options, function (err, res, body) {
      if (res && (res.statusCode === 200 || res.statusCode === 201)) {
        console.log(body);
      } else {
        console.log("Failed to send update to HQ"); 
      }
    });
    res.json(require("../../Commons/js/response").success);
  });
  return router;
};
