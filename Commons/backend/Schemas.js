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


    var updateHQSchema = new Schema({
        "Crisis ID": Number,
        "Status": String,
        "Comments": String
    }, { versionKey: false });

    //Added by sw
    var departmentOrderSchema = new Schema({
        DepartmentID: String,
        SquadID: String,
        Lat: Number,
        Lon: Number,
        CrisisID: Number,
        Severity: Number,
        Comments: String
    }, { versionKey: false });

    var updateDeptSchema = new Schema({
        "CrisisID": Number,
        "Status": String,
        "Comments": String
    }, { versionKey: false });

    var models = {
        DepartmentDB: mongoose.model("DepartmentDB", departmentDBSchema),
        Crisis: mongoose.model("Crisis", crisisSchema),
        UpdateHQ: mongoose.model("UpdateHQ", updateHQSchema),
        DepartmentOrder: mongoose.model("DepartmentOrder", departmentOrderSchema),
        UpdateDept : mongoose.model("UpdateDept", updateDeptSchema)
    };
    
    return models;
}