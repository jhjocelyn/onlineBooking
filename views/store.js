//app
// /*
//     author: Hui Jiang
//     date: 08 March 2018
//     @Melbourne
// */

// var express               = require("express"),
//     mongoose              = require("mongoose"),
//     passport              = require("passport"),
//     bodyParser            = require("body-parser"),
//     User                  = require("./models/user"),
//     LocalStrategy         = require("passport-local"),
//     passportLocalMongoose = require("passport-local-mongoose")


// mongoose.connect("mongodb://localhost/booking");
// var app = express();
// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(require("express-session")({
//     secret: "Rusty is the best and cutest dog in the world",
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// //=======================
// //ROUTES
// //=======================

// //HOME
// app.get("/",function(req,res){
//     res.render("home");
// });


// // ACCOUNT INFO

// app.get("/account",function(req,res){
//     res.send("You Logged in!");
// });

// // app.get("/account/:id",function(req,res){
// //     var id = req.params.id;
// //     res.render("account",{id:id});
// // });


// //REGISTER ROUTES
// app.get("/register",function(req,res){
//     res.render("register");
// });

// app.post("/register", function(req, res){
//     User.register(new User({username: req.body.email}), req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render('register');
//         }
//         passport.authenticate("local")(req, res, function(){
//            res.redirect("/account");
//         });
//     });
// });


// //LOGIN ROUTES
// app.get("/login", function(req, res){
//     res.render("login");
// });

// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/secret",
//     failureRedirect: "/"
// }) ,function(req, res){
// });




// //START LOCAL SEVER
// app.listen(9999,'localhost',function(){
//     console.log("server is ready!");
// });

// //UNCOMMENT IT IN THE FUTURE
// // app.listen(process.env.PORT,process.env.IP);

//account
<!-- <% include partials/header.ejs%>

<h1>Account Page</h1>
<h1><%= id%></h1>

//register
<!-- <% include partials/header.ejs%>

<h1>Sign Up form</h1>

<form action="/register" method="POST">
    <input type="text" name ="email" placeholder="email">
    <input type="password" name="password" placeholder="password">
    <button>Submit</button>

</form>


//login in
<!-- <h1>Login Page</h1>


<form action="/login" method="POST">
    <input type="text" name="email" placeholder="email">
    <input type="password" name="pwd" placeholder="password">
    <button>Login</button>
</form> -->






//home
<!-- <% include partials/header.ejs%>

<h1>HOME PAGE</h1>
<ul>

    <li><a href="/register">Sign Up</a></li>
    <li><a href="/login">Login</a></li>
    <li><a href="/logout">Logout</a></li>
</ul>
 -->














