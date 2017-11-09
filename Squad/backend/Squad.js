module.exports = function (io, mongoose, Schemas) {
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
        // if (req.session && req.session.token==="powerSquad"){
        //     console.log("hq cookie accepted!");
        //     var html = fs.readFileSync(__dirname + "/../views/index.html");
        //     res.end(html);
        //   }
        //   else{
        //     console.log("no cookie found!");
        //     res.redirect(`/login?redirect=${req.originalUrl}`);
        //   } 
    });

    /* When app first loaded */
    router.get("/getPastOrders", function (req, res) {
        console.log("getting squad past orders");
        var departmentID = req.query.dept;
        var squadID = req.query.squad.toString();
        var filter = { DepartmentID: departmentID,SquadID:squadID}
        console.log(filter);
        Schemas.SquadOrder.find(filter).lean().exec(function (err, data) {
            res.json(data);
        });
    });

    /* TO DO */
    /* Order below and receive update from below, and receive order from above and update above */
    router.post("/OrderSquad", [urlencodedParser, jsonParser], function (req, res) {
        var squadOrder = Schemas.SquadOrder({
            DepartmentID: req.body.DepartmentID,
            SquadID: req.body.SquadID,
            Lat: req.body.Lat,
            Lon: req.body.Lon,
            CrisisID: req.body.CrisisID,
            Severity: req.body.Severity,
            Comments: req.body.Comments
        });

        squadOrder.save(function (err, dat) {
            if (err) console.log("Failed to save squad order log");
        });
        console.log("squad ReceivedeptOrder");
        console.log(squadOrder);
        io.emit("SquadReceiveOrder", squadOrder);
        res.end("success");
    });

    router.post("/updateDept", urlencodedParser, function (req, res) {
        console.log("updateDept");
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
            url: `http://${host}/Dept${req.body.DepartmentID}/updateDept`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        console.log(`http://${host}/Dept${req.query.DepartmentID}/updateDept`);
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
