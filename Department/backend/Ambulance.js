module.exports = function (io) {
    var express = require("express"),
        app = express(),
        router = express.Router(),
        bodyParser = require("body-parser"),
        urlencodedParser = bodyParser.urlencoded({extended: false}),
        jsonParser = bodyParser.json({limit: "500mb"}),
        fs = require("fs");
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

    router.get("/initialiseSquadLocations", function (req, res) {
        id = 0;
        for (id = 0; id < 10; id++) {
            var squadLocation = SquadLocation({
                Lat: 1.367448,
                Lon: 103.803256,
                Type: "",
                ID: id
            })
            squadLocation.save(function (err, dat) {
            });
        }
    })

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

    return router;
};