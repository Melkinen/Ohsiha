var User = require('../models/user');
var HelpingFunctions = require('../javascriptFunctions/helpingFunctions');
var passport = require('passport');
var mongoose = require('mongoose');
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
  changeUserInformation: function(req,res,next){
    console.log("change user information " + req.user);
    User.findOne({username: req.user.username},function(err,foundUser){
      if (!foundUser){
        console.log("error user not dound")
        return next(new Error('Could not load User'));
      }
      else{
        console.log("user found "+ foundUser)
          // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.
        console.log(req.body.name +  req.body.age +req.body.hometown);
        foundUser.name = req.body.name;
        foundUser.meta.age = req.body.age;
        foundUser.updated_at = HelpingFunctions.getDateNow();
        foundUser.hometown = req.body.hometown;

        console.log("here")

        // Save the updated document back to the database
        foundUser.save(function (err, todo) {
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


  }



}

module.exports = userQueries ;
