module.exports = function (io, mongoose, Schemas) {
    var express = require("express"),
        app = express(),
        router = express.Router(),
        bodyParser = require("body-parser"),
        urlencodedParser = bodyParser.urlencoded({ extended: false }),
        jsonParser = bodyParser.json({ limit: "500mb" }),
        fs = require("fs"),
        Schema = mongoose.Schema;


    router.get("/getCrisisAndPlans",function(req,res){
        Schemas.Crisis.aggregate(
            [
              { $group : { _id : "$CrisisID", PlanID: { $addToSet: "$PlanID" } } }
            ],
            function (err,result){
                if (err) console.log(err);
                res.json(result);
            }
         )
    })

    router.get("/getLocations", function (req, res) {
        console.log("Getting locations");
        console.log(`Parameters are ${req.query.id}`);
        if (req.query.id=="HQ" || req.query.id == null){
            Schemas.DepartmentDB.find().lean().exec(function (err, data) {
                result = [];
                for (var _data of data) {
                    if (_data.SquadStatus === "Active" || _data.SquadStatus === "On-going" ||_data.SquadStatus === "Cleared") {
                        result.push(_data);
                    }
                }
                res.json(result);
            });
        }   
        else {
            var filter = {$or:[{DepartmentID:req.query.id},{DepartmentID:"Crisis"}]}
            Schemas.DepartmentDB.find(filter).lean().exec(function (err, data) {
                result = [];
                for (var _data of data) {
                    if (_data.SquadStatus === "Active" || _data.SquadStatus === "On-going"||_data.SquadStatus === "Cleared") {
                        result.push(_data);
                    }
                }
                res.json(result);
            });
        }
    });

    /* Use during testing only */
    router.get("/initialiseSquadLocations", function (req, res) {
        var departments = ["Fire", "Hazmat", "Bomb"];
        variance = 0;
        for (var department of departments) {
            for (id = 1; id < 11; id++) {
                variance += 0.01
                var departmentDB = Schemas.DepartmentDB({
                    DepartmentID: department,
                    SquadID: id.toString(),
                    SquadStatus: "Available",
                    Lat: 1.367448 + variance,
                    Lon: 103.803256 + variance,
                    CrisisType: ""
                });

                departmentDB.save(function (err, data) { });
            }
        }
        res.end("success");
    })

    router.get("/resetDB",function(req,res){
        Schemas.DepartmentDB.remove({});
        Schemas.Crisis.remove({});
        Schemas.UpdateDept.remove({});
        Schemas.UpdateHQ.remove({});
        Schemas.DepartmentOrder.remove({});
        Schemas.SquadOrder.remove({});
        res.end("success");
    })
    router.get("/",function(req,res){
        var html = fs.readFileSync(__dirname + "/login2.html");
        res.end(html);
    })
    router.get("/login",function(req,res){
        var html = fs.readFileSync(__dirname + "/login.html");
        res.end(html);
    });

    router.get("/Squadlogin",function(req,res){
        var html = fs.readFileSync(__dirname + "/login2.html");
        res.end(html);
    });

    router.get("/validateUser",function(req,res){
        var username = req.query.username;
        var password = req.query.password;
        var redirect = req.query.redirect;
        if (username==="root" && password==="root" && redirect==="/HQ"){
            req.session.token = "powerHQ";
        } else if (username==="root" && password==="root" && redirect.toLocaleLowerCase()==="/deptfire"){
            req.session.token = "powerFire";
        } else if (username==="root" && password==="root" && redirect.toLocaleLowerCase()==="/depthazmat"){
            req.session.token = "powerHazmat";
        } else if (username==="root" && password==="root" && redirect.toLocaleLowerCase()==="/deptbomb"){
            req.session.token = "powerBomb";
        } else if (username==="root" && password==="root" && redirect.toLocaleLowerCase().startsWith("/squad")){
            req.session.token = "powerSquad";
        } 
        else {
            res.status(401)        // HTTP status 404: NotFound
            .send('Unauthorized');
            return;
        }
        res.redirect(redirect);
    })

    return router;
};
