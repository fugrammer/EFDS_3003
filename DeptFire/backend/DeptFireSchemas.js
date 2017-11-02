var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var crisisSchema = new Schema({
    CrisisID: Number,
    PlanID: Number,
    CrisisType: String,
    Lat: Number,
    Lon: Number,
    Status: String,
    Description: String,
    SuggestedActions: [{
        "DepartmentType": String,
        "SeverityRating": String
    }
    ],
    PointOfContact: String
}, { versionKey: false });

var Crisis = mongoose.model("Crisis", crisisSchema);

var updateHQSchema = new Schema({
    "Crisis ID": Number,
    "Status": String,
    "Comments": String
}, { versionKey: false });

var UpdateHQ = mongoose.model("UpdateHQ", updateHQSchema);

// var squadLocationSchema = new Schema({
//     Lat: Number,
//     Lon: Number,
//     Type: String,
//     ID: String,
//     CrisisType: String
// }, { versionKey: false });

// var SquadLocation = mongoose.model("SquadLocation", squadLocationSchema);

//Added by sw
var departmentOrderSchema = new Schema({
    DepartmentID : String,
    SquadID: String,
    Lat: Number,
    Lon: Number,
    CrisisID: Number,
    Severity: Number,
    Comments: String
  }, { versionKey: false });

var DepartmentOrder = mongoose.model("DepartmentOrder", departmentOrderSchema);

//Orders from/to CMO
module.exports.Crisis = Crisis;
//Updates from Dept
module.exports.UpdateHQ = UpdateHQ;
// module.exports.SquadLocation = SquadLocation;
//module.exports.DepartmentDB = DepartmentDB;
