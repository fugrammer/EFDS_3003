module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var departmentDBSchema = new Schema({
        DepartmentID: String,
        SquadID: String,
        SquadStatus: String, // Active, Inactive, Unavailable
        CrisisType: String,
        Lat: Number,
        Lon: Number
    }, { versionKey: false });

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

    //Added by sw
    var departmentOrderSchema = new Schema({
        DepartmentID: String,
        NumberOfSquads: String,
        Lat: Number,
        Lon: Number,
        CrisisID: Number,
        Severity: Number,
        Comments: String
    }, { versionKey: false });

    var squadOrderSchema = new Schema({
        SquadID: String,
        CrisisID: Number,
        Lat: Number,
        Lon: Number,
        Severity: Number,
        Comments: String
    }, { versionKey: false });

    var updateHQSchema = new Schema({
        DepartmentID: String,
        CrisisID: Number,
        Status: String,
        Comments: String
    }, { versionKey: false });

    var updateDeptSchema = new Schema({
        DepartmentID: String,
        SquadID: String,
        CrisisID: Number,
        Status: String,
        Comments: String,
        Lat: Number,
        Lon: Number
    }, { versionKey: false });

    var models = {
        DepartmentDB: mongoose.model("DepartmentDB", departmentDBSchema),
        Crisis: mongoose.model("Crisis", crisisSchema),
        UpdateHQ: mongoose.model("UpdateHQ", updateHQSchema),
        DepartmentOrder: mongoose.model("DepartmentOrder", departmentOrderSchema),
        UpdateDept: mongoose.model("UpdateDept", updateDeptSchema),
        SquadOrder: mongoose.model("SquadOrder", squadOrderSchema)
    };

    return models;
}