var departmentDBSchema = new Schema({
    DepartmentID : String,
    SquadID: Number,
    SquadStatus: String, // Active, Inactive, Unavailable
    Lat: Number,
    Lon: Number}, { versionKey: false });

var DepartmentDB = mongoose.model("DepartmentDB", departmentDBSchema);

module.exports.DepartmentDB = DepartmentDB;