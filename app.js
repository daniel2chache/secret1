//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();


console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


//-------connection to the DB --------------------------------
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//---- end of db connection ---------------------------------

//---- Create Schema for the db --------------------------
// const userSchema = {
//
//   email: String,
//   password: String
// };


var userSchema = new mongoose.Schema({
  email: String,
  password: String
    // whatever else
});

//----- End of schema creation ----------------------------


//--------Encryption of single item ------------

// const secret = "thisisourlittlesecret."   //moved to env
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });  // should be before the model always

//--------- end of the encryption part -----------------------------------



//----Create Model  NB. Capitalized and in singular form ------

const User = mongoose.model("User", userSchema);

//-------end of model creation --------------------------------

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});



app.post("/register", function (req,res){
  const newUser= new User ({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save(function (err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    }else{
      if(foundUser){
        if (foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
