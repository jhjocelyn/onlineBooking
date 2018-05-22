var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AppointmentSchema = new mongoose.Schema({
    date: String,
    time: String,
    dogBreed: String,
    service: String,
    comment: String,
    owner: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
});


module.exports = mongoose.model("Appointment",AppointmentSchema);