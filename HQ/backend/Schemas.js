var crisisSchema = new Schema({
    CrisisID: Number,
    PlanID: Number,
    CrisisType: String,
    Lat: Number,
    Lon: Number,
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

var squadLocationSchema = new Schema({
    Lat: Number,
    Lon: Number,
    Type: String,
    ID: Number
}, { versionKey: false });

var SquadLocation = mongoose.model("SquadLocation", squadLocationSchema);
