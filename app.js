//jshint esversion:6
require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-find-or-create");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var FacebookStrategy = require('passport-facebook');
var fs = require('fs');
var path = require('path');
const port = 3000;


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery", true);

mongoose.connect("mongodb+srv://andreeasarb96:andreeasarb21072018@cluster0.61szlim.mongodb.net/ProiectDisertatieDB");

//quizzSchema-structura tabel chestionare
const quizzSchema = new mongoose.Schema({
  categorie: String,
  intrebare: String,
  imagine: String,
  raspuns1: String,
  raspuns2: String,
  raspuns3: String,
  raspunscorect1: String,
  raspunscorect2: String,
  raspunscorect3: String
});

const Quizz = mongoose.model("Quizz", quizzSchema);

//lawSchema-structura tabel legislatie rutiera
const lawSchema = new mongoose.Schema({
  capitol: String,
  articol: String,
  sectiune: String,
  subsectiune: String,
  alineat: String
});

const Law = mongoose.model("Law", lawSchema);

//roadsignsSchema-structura tabel semne de circulatie
const roadsignSchema = new mongoose.Schema({
  tip: String,
  imagine: String,
  titlu: String,
  explicatie: String
});

const RoadSign = mongoose.model("RoadSign", roadsignSchema);

//userSchema-structura tabel utilizatori inregistrati
const userSchema = new mongoose.Schema({
  nume: String,
  prenume: String,
  telefon: Number,
  varsta: Date,
  email: String,
  parola: String,
  googleId: String,
  facebookId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//usercontactSchema-structura tabel utilizatori care contacteaza siteul
const usercontactSchema = new mongoose.Schema({
  nume: String,
  prenume: String,
  email: String,
  telefon: Number,
  mesaj: String
});

const UserContact = mongoose.model("UserContact", usercontactSchema);

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://driving-licence-learning-app.onrender.com/auth/google/index",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://driving-licence-learning-app.onrender.com/auth/facebook/index"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/quizztype", function(req, res){
  res.render("quizztype");
});

app.get("/recover", function(req, res){
  res.render("recover");
});

app.get("/roadsigns", function(req, res){
  res.render("roadsigns");
});

app.post("/result", function(req, res){
  console.log(req.body);
  res.render("result", {result: req.body});
});

app.get("/quizz1", function(req, res){
  Quizz.find({categorie: "Categoria A"}, function(err, foundQuizz){
    res.render("quizz1", {Quizz: foundQuizz});
  });
});

app.get("/quizz2", function(req, res){
  Quizz.find({categorie: "Categoria B"}, function(err, foundQuizz){
    res.render("quizz2", {Quizz: foundQuizz});
  });
});

app.get("/quizz3", function(req, res){
  Quizz.find({categorie: "Categoria C"}, function(err, foundQuizz){
    res.render("quizz3", {Quizz: foundQuizz});
  });
});

app.get("/quizz4", function(req, res){
  Quizz.find({categorie: "Categoria D"}, function(err, foundQuizz){
    res.render("quizz4", {Quizz: foundQuizz});
  });
});

app.get("/quizz5", function(req, res){
  Quizz.find({categorie: "Categoria E"}, function(err, foundQuizz){
    res.render("quizz5", {Quizz: foundQuizz});
  });
});

app.get("/quizz6", function(req, res){
  Quizz.find({}, function(err, foundQuizz){
    res.render("quizz6", {Quizz: foundQuizz});
  });
});

app.get("/quizz7", function(req, res){
  Quizz.find({categorie: "Categoria Tr"}, function(err, foundQuizz){
    res.render("quizz7", {Quizz: foundQuizz});
  });
});

//req=request res=response
app.get("/img1", function(req, res){
  RoadSign.find({tip: "De avertizare"}, function(err, foundRoadSign){
    res.render("img1", {RoadSign: foundRoadSign});
  });
});

app.get("/img2", function(req, res){
  RoadSign.find({tip: "De interzicere sau restrictie"}, function(err, foundRoadSign){
    res.render("img2", {RoadSign: foundRoadSign});
  });
});

app.get("/img3", function(req, res){
  RoadSign.find({tip: "De prioritate"}, function(err, foundRoadSign){
    res.render("img3", {RoadSign: foundRoadSign});
  });
});

app.get("/img4", function(req, res){
  RoadSign.find({tip: "De obligare"}, function(err, foundRoadSign){
    res.render("img4", {RoadSign: foundRoadSign});
  });
});

app.get("/img5", function(req, res){
  RoadSign.find({tip: "De informare"}, function(err, foundRoadSign){
    res.render("img5", {RoadSign: foundRoadSign});
  });
});

app.get("/img6", function(req, res){
  RoadSign.find({tip: "De orientare"}, function(err, foundRoadSign){
    res.render("img6", {RoadSign: foundRoadSign});
  });
});

app.get("/img7", function(req, res){
  RoadSign.find({tip: "De informare turistica"}, function(err, foundRoadSign){
    res.render("img7", {RoadSign: foundRoadSign});
  });
});

app.get("/img9", function(req, res){
  RoadSign.find({tip: "Semnale luminoase"}, function(err, foundRoadSign){
    res.render("img9", {RoadSign: foundRoadSign});
  });
});

app.get("/img10", function(req, res){
  RoadSign.find({tip: "Indicatoare instalate la trecerea cu calea ferată"}, function(err, foundRoadSign){
    res.render("img10", {RoadSign: foundRoadSign});
  });
});

app.get("/img11", function(req, res){
  RoadSign.find({tip: "Indicatoare kilometrice"}, function(err, foundRoadSign){
    res.render("img11", {RoadSign: foundRoadSign});
  });
});

app.get("/img12", function(req, res){
  RoadSign.find({tip: "Mijloace auxiliare de semnalizare a lucrărilor"}, function(err, foundRoadSign){
    res.render("img12", {RoadSign: foundRoadSign});
  });
});

app.get("/img13", function(req, res){
  RoadSign.find({tip: "Dispozitive luminoase pentru dirijarea circulației pe benzi reversibile"}, function(err, foundRoadSign){
    res.render("img13", {RoadSign: foundRoadSign});
  });
});

app.get("/img14", function(req, res){
  RoadSign.find({tip: "Marcaje longitudinale"}, function(err, foundRoadSign){
    res.render("img14", {RoadSign: foundRoadSign});
  });
});

app.get("/img15", function(req, res){
  RoadSign.find({tip: "Marcaje transversale"}, function(err, foundRoadSign){
    res.render("img15", {RoadSign: foundRoadSign});
  });
});

app.get("/img16", function(req, res){
  RoadSign.find({tip: "Marcaje diverse"}, function(err, foundRoadSign){
    res.render("img16", {RoadSign: foundRoadSign});
  });
});

app.get("/img17", function(req, res){
  RoadSign.find({tip: "Marcaje laterale"}, function(err, foundRoadSign){
    res.render("img17", {RoadSign: foundRoadSign});
  });
});

app.get("/img18", function(req, res){
  RoadSign.find({tip: "Marcaje temporare pentru semnalizarea lucrărilor în zona drumului public"}, function(err, foundRoadSign){
    res.render("img18", {RoadSign: foundRoadSign});
  });
});


app.get("/img20", function(req, res){
  RoadSign.find({tip: "Semnalele polițistului rutier"}, function(err, foundRoadSign){
    res.render("img20", {RoadSign: foundRoadSign});
  });
});

app.get("/", function(req, res){
res.render("login");
});

app.get("/cap1", function(req, res){
  Law.find({capitol: "Cap. I"}, function(err, foundLaws){
    res.render("cap1", {Laws: foundLaws});
  });
});

app.get("/cap2", function(req, res){
  Law.find({capitol: "Cap. II"}, function(err, foundLaws){
    res.render("cap2", {Laws: foundLaws});
  });
});

app.get("/cap3", function(req, res){
  Law.find({capitol: "Cap. III"}, function(err, foundLaws){
    res.render("cap3", {Laws: foundLaws});
  });
});

app.get("/cap4", function(req, res){
  Law.find({capitol: "Cap. IV"}, function(err, foundLaws){
    res.render("cap4", {Laws: foundLaws});
  });
});

app.get("/cap5", function(req, res){
  Law.find({capitol: "Cap. V"}, function(err, foundLaws){
    res.render("cap5", {Laws: foundLaws});
  });
});

app.get("/cap6", function(req, res){
  Law.find({capitol: "Cap. VI"}, function(err, foundLaws){
    res.render("cap6", {Laws: foundLaws});
  });
});

app.get("/cap7", function(req, res){
  Law.find({capitol: "Cap. VII"}, function(err, foundLaws){
    res.render("cap7", {Laws: foundLaws});
  });
});

app.get("/cap8", function(req, res){
  Law.find({capitol: "Cap. VIII"}, function(err, foundLaws){
    res.render("cap8", {Laws: foundLaws});
  });
});

app.get("/cap9", function(req, res){
  Law.find({capitol: "Cap. IX"}, function(err, foundLaws){
    res.render("cap9", {Laws: foundLaws});
  });
});

app.get("/cap10", function(req, res){
  Law.find({capitol: "Cap. X"}, function(err, foundLaws){
    res.render("cap10", {Laws: foundLaws});
  });
});

app.get("/cap11", function(req, res){
  Law.find({capitol: "Cap. XI"}, function(err, foundLaws){
    res.render("cap11", {Laws: foundLaws});
  });
});

app.get("/admin", function(req, res){
  res.render("admin");
});

app.post("/admin", function(req, res){
  const law = new Law({
  capitol: req.body.capitol,
  articol: req.body.articol,
  sectiune: req.body.sectiune,
  subsectiune: req.body.subsectiune,
  alineat: req.body.alineat
  });
  law.save();
  const roadsign = new RoadSign({
    tip: req.body.tip,
    imagine: req.body.imagine,
    titlu: req.body.titlu,
    explicatie: req.body.explicatie
  });
  roadsign.save();
  const quizz = new Quizz({
    categorie: req.body.categorie,
    intrebare: req.body.intrebare,
    imagine: req.body.imagine,
    raspuns1: req.body.r1,
    raspuns2: req.body.r2,
    raspuns3: req.body.r3,
    raspunscorect1: req.body.rc1,
    raspunscorect2: req.body.rc2,
    raspunscorect3: req.body.rc3
  });
  quizz.save();
});

//inregistrare cu google
app.get("/auth/google", passport.authenticate("google",{scope:["profile"]}));

app.get('/auth/google/index',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/index');
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/index',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/index');
    });

//pagina login
app.get("/login", function(req, res){
  res.render("login");
})

//inregistrare utilizator(adaugare utilizator)
app.get("/register", function(req, res){
res.render("register");
});


app.get("/index", function(req, res){
if(req.isAuthenticated()){
  res.render("index");
}else{
  res.redirect("/login");
}
});

app.post("/register", function(req, res){
	console.log("Registerrr")
  bcrypt.hash(req.body.parola, saltRounds, function(err, hash) {
    const newUser = new User({
      nume: req.body.nume,
      prenume: req.body.prenume,
      telefon: req.body.telefon,
      varsta: req.body.varsta,
      email: req.body.email,
      parola: hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("index");
      }
    });
});

});

//logare in aplicatie
app.post("/login", function(req, res){
  console.log("loginn post")
  const user = req.body.email;
  const parola = req.body.parola;
  User.findOne({email:user}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(parola, foundUser.parola, function(err, result) {
          if(result === true){
            res.render('index');
          }
      });
      }
    }
  });
});

app.post("/recover", function(req, res){
  const email = req.body.email;
  User.findOne({email:user}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(email, foundUser.email, function(err, result) {
          if(result === true){
            res.render("contact");
          }
      });
      }
    }
  });
});

//realizare chestionar
app.get("/quizz", function(req, res){
  res.render("quizz");
});

//indicatoare rutiere
app.get("/roadsigns", function(req, res){
  res.render("roadsigns");
});

//legislatie rutiera
app.get("/law", function(req, res){
  res.render("law");
});
//contact
app.get("/contact", function(req, res){
  res.render("contact");
});

app.post("/contact", function(req, res){
  const usercontact = new UserContact({
    nume: req.body.nume,
    prenume: req.body.prenume,
    email: req.body.email,
    telefon: req.body.telefon,
    mesaj: req.body.mesaj
  });
  usercontact.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("contact");
    }
  });
});

app.listen(3000, function(){
  console.log("Server starting on port 3000");
});
