module.exports = function (mongoose) {
    var Schema = mongoose.Schema
    var departmentDBSchema = new Schema({
        DepartmentID: String,
        SquadID: String,
        SquadStatus: String, // Active, Inactive, Unavailable
        CrisisType: String,
        Lat: Number,
        Lon: Number
    }, { versionKey: false });
    var models = {
        DepartmentDB : mongoose.model("DepartmentDB", departmentDBSchema)
    };
    return models;
}