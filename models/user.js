var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    homeAddress: String,
    mobileNumber:Number,
    homeNumber:Number,
    WorkNumber:Number,
    dogName: String,
    dogDob: String,
    dogBreed: String,
    isBooked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isInfo: { type: Boolean, default: false },
    appointments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Appointment"
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);