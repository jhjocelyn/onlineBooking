var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/booking");
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname +'/public'));
app.use(bodyParser.urlencoded({extended: true}));
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

//============
// ROUTES
//============

// HOME
app.get("/", function(req, res){
    res.render("home");
});


//ACCOUNT - AFTER LOGGED IN
app.get("/account",isLoggedIn,function(req, res){
    res.render("account");
});


// app.post("/account/:id",function(req,res){
//     var id = req.params.id;
//     var firstname = req.body.firstname;
//     var lastname = req.body.lastname;
//     var
//     User.findById(id,function(err,user){
//         user.firstname()
//     });
// });

//REGISTER HERE
app.get("/register", function(req, res){
   res.render("register");
});


//SEND REGISTRATION FORM -> ACCOUNT PAGE
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/account");
        });
    });
});


//LOGIN PAGE
app.get("/login", function(req, res){
   res.render("login");
});

//SEND LOGIN IN INFO -> ACCOUNT
// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/account",
//     failureRedirect: "/login"
// }) ,function(req, res){
// });

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(9999,'localhost',function(){
    console.log("server is ready!");
});



