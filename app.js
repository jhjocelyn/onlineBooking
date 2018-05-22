var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    Appointment = require("./models/appointment"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
var app = express();
mongoose.connect("mongodb://localhost/booking");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

function timeToIndex(time){
    if(time === "09:00-10:30"){
        return 0;
    }else if(time === "10:30-12:00"){
        return 1;
    }else if(time === "13:00-14:30"){
        return 2;
    }else if(time === "14:30 - 16:00"){
        return 3;
    }else{
        return 4;
    }
}

app.get("/selected",function(req,res){
    var sdate = req.query.date;
    Appointment.find({date:sdate},function(err,apps){
        if(err){
            console.log(err);
        }else{
            var selected = [];
            if(apps){
                    apps.forEach(function(app){
                    var index = timeToIndex(app.time)
                    selected.push(index);
                    if(selected.length === apps.length){
                        res.json({data:selected});
                    }
                });
            }

        }
    });
});


//=============
// HOME ROUTES
//=============


// HOME - GET
app.get("/", function(req, res) {
    res.render("home");
    // var id ="5b02d7e596fac71abea4c6ae";
    // User.findById(id,function(err,user){
    //     user.isAdmin = true;
    //     user.save();
    // });
});


//=================
// ACCOUNT ROUTES
//=================


//ACCOUNT - GET
app.get("/account/:id", isLoggedIn, function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if(user.isAdmin){
                Appointment.find({},function(err,apps){
                    if(app.length===0){
                        res.redirect("/");
                    }
                    var owners = [];
                    apps.forEach(function(app){
                        User.findById(app.owner.id,function(err,owner){
                            owners.push(owner);
                             if(owners.length === apps.length){
                                res.render("admin",{apps:apps,owners:owners});
                             }
                        });
                    });
                });
            }else if (user.isBooked) {
                var bookings=[];
                var appointments = user.appointments;
                for(let i=0;i<appointments.length;i++){
                    Appointment.findById(appointments[i],function(err,appointment){
                        bookings.push(appointment);
                        if(i === appointments.length-1){
                            res.render("account2",{user:user,bookings:bookings});
                        }
                    });
                }
            }else if(user.isInfo) {
                 res.render("account2", {user:user});
            }else {
                res.render("account", {id:id});
            }
        }
    })
});


//ACCOUNT - POST USER INFO FORM
app.post("/account/:id", isLoggedIn, function(req, res) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) {
            res.redirect("/");
        } else {
            user.firstName = req.body.firstname;
            user.lastName = req.body.lastname;
            user.homeAddress = req.body.homeaddress;
            user.mobileNumber = req.body.mobilenumber;
            user.homeNumber = req.body.homenumber;
            user.workNumber = req.body.worknumber;
            user.dogName = req.body.dogname;
            user.dogDob = req.body.dogdob;
            user.dogBreed = req.body.dogbreed;
            user.isInfo = true;
            user.save();
            res.redirect(`/account/${id}`);
        }
    });
});


//=================
// REGISTER ROUTES
//=================


//REGISTER - GET
app.get("/register", function(req, res) {
    res.render("register");
});


//REGISTER - POST
app.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/account/" + user._id);
        });
    });
});


//=================
// LOGIN ROUTES
//=================


//LOGIN - GET
app.get("/login", function(req, res) {
    res.render("login");
});


//LOGIN - POST
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {});


//LOGOUT
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});



//================
//BOOKING ROUTES
//================


//BOOKING - GET
app.get("/booking/:id", isLoggedIn, isInfoFinished, function(req, res) {
    var id = req.params.id;
    res.render("booking", { id: id });
});


//BOOKING - POST
app.post("/booking/:id", isLoggedIn, isInfoFinished, function(req, res) {
    var id = req.params.id;
    var app = new Appointment ({
        //_id: req.body.datepicker+"-"+req.body.timepicker,
        date: req.body.datepicker,
        time: req.body.timepicker,
        dogBreed: req.body.dogbreed,
        service: req.body.service,
        comment: req.body.comment
    });

    Appointment.create(app,function(err,appointment){
        if(err){console.log(err);}
        else{
            appointment.owner.id = id;
            appointment.save();
            User.findById(id,function(err,user){
                if(err){
                    console.log(err);
                    res.redirect(`/booking/${id}`)
                }else{
                    user.appointments.push(appointment);
                    user.isBooked = true;
                    user.save();
                    res.redirect(`/account/${id}`);
                }
            });
        }

    });
});




//CANCEL A BOOK
app.post("/cancelbook/:id",isLoggedIn,function(req,res){
    var userId = req.params.id;
    var appId = req.body.appointmentId;
    //delete app in App
    Appointment.deleteOne({_id:appId},function(err){
        if(err){
            console.log(err);
        }else{
            console.log("app deleted: "+ appId);
            //delete app in userlist
            User.findById(userId,function(err,user){
                if(err){
                    console.log(err);
                }else{
                    var index = user.appointments.indexOf(appId);
                    user.appointments.splice(index,1);
                    if(user.appointments.length === 0){
                        user.isBooked = false;
                    }
                    user.save();
                    console.log("app deleted from user list!");
                    res.redirect(`/account/${userId}`);
                }
            });
        }
    });

});


//REBOOK
app.post("/rebook/:id",isLoggedIn,function(req,res){
    var appId = req.body.appointmentId;
    var userId = req.params.id;
    Appointment.findById(appId,function(err,app){
        if(err){
            console.log(err);
        }else{
            res.render("rebooking",{id:userId,app:app});
        }
    })

});




//REBOOKING - POST
app.post("/rebooking/:id",isLoggedIn,isInfoFinished,function(req,res){
    var appId = req.body.appointmentId;
    var userId = req.params.id;
    Appointment.findById(appId,function(err,app){
        if(err){
            console.log(err);
        }else{
            app.date = req.body.datepicker;
            app.time = req.body.timepicker;
            app.dogBreed = req.body.dogbreed;
            app.service = req.body.service;
            app.comment = req.body.comment;
            app.save();
            res.redirect(`/account/${userId}`);
        }
    });
});




//MIDDLEWARES
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function isInfoFinished(req, res, next) {
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if (err) {
            res.redirect("/");
        } else {
            if (user.isInfo) {
                return next();
            } else {
                res.redirect("/account/" + id);
            }
        }
    });
}


//SERVER
app.listen(9999, 'localhost', function() {
    console.log("server is ready!");
});












