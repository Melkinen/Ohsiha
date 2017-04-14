var User = require('../models/user');
var HelpingFunctions = require('../javascriptFunctions/helpingFunctions');
var passport = require('passport');
var mongoose = require('mongoose');
var jwt  = require('jwt-simple');
var config  = require('../config/database.js'); // get db config file
var Match = require('../models/match');
var userQueries ={



createNewUSer: function(req,res,next){
      var day = HelpingFunctions.getDateNow();
      console.log(req.body.username)
      console.log(req.body.name)

      User.register(new User({password :req.body.password, username : req.body.username, name: req.body.name, created_at: day}), req.body.password, function(err, account) {
          if (err) {
            console.log(err);
              res.status(406).send(err);
          }

          passport.authenticate('local')(req, res, function () {
              res.send('succes');
          });
      });
  },
  changeUserInformation: function(req,res,next,token){
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {

        console.log("user found "+ user);
        //console.log(req.body.name +  req.body.age +req.body.hometown);
        user.name = req.body.name;
        user.meta.age = req.body.age;
        user.updated_at = HelpingFunctions.getDateNow();
        user.hometown = req.body.hometown;

        // Save the updated document back to the database
        user.save(function (err, todo) {
            if (err) {
                console.log("error saving")
                res.status(500).send(err)
            }
            res.send("User information saved");
        });
        }
    });
  },

  getAllUsers: function(req,res,next){
  User.find({},"name username created_at", function(err, users) {
    if (err) throw err;

    // object of all the users
    console.log(users);
    res.send(users);
});
  },

  getOneUserInformation: function(req,res,next){
    User.findOne( {_id: req.user.id}, function(err, foundUser) {
      if (err) throw err;
      // object of all the users
      console.log(foundUser);
      res.render('userInformation', {user: req.user, "foundUser": foundUser});

  });


},
  apiGetOneUserInformation: function(req,res,next){
    User.findOne( {_id: req.user.id}, function(err, foundUser) {
      if (err) throw err;
      // object of all the users
      console.log(foundUser);
      res.send({user: req.user, "foundUser": foundUser});

  });


},

getOneUsersMatchesBYToken : function (req,res,next,token){
  var decoded = jwt.decode(token, config.secret);
  User.findOne({
    username: decoded.username
  }, function(err, user) {
      if (err) throw err;
      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
      console.log(user);
      Match.find({$or:[{player1: user.username},{player2: user.username}]}, function(err, matches) {
        if (err) throw err;
        console.log(matches);
        res.render('usersMatchHistory',{'user':user,'foundMatches': matches});
        });
      }
  });
}


}

module.exports = userQueries ;
