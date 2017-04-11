var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var jwt  = require('jwt-simple');
var config  = require('../config/database.js'); // get db config file
var User = require('../models/user.js');
var Match = require('../models/match.js');
var userQueries = require('../dataBaseQueries/userQueries')
var matchQueries = require('../dataBaseQueries/matchQueries')
var passport  = require('passport');
require('../config/passport')(passport)
//Now, this call won't fail because User has been added as a schema.
//var User = mongoose.model(User);

/* GET home page. */

router.get('/', function(req, res, next) {
  console.log('called /');
  res.render('index', {user:req.user, title: 'Sulkapallo Järjestelmä' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registeration' });
});
router.post('/register', function(req, res) {

  if (!req.body.name || !req.body.password) {
  res.json({success: false, msg: 'Please pass name and password.'});
} else {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    created_at: getDateNow()
  });
  // save the user
  newUser.save(function(err) {
    if (err) {
      console.log(err);
      return res.json({success: false, msg: 'Username already exists.'});
    }
    res.json({success: true, msg: 'Successful created new user.'});
  });
}
});



/*
    User.register(new User({password :req.body.password, username : req.body.username ,name: req.body.name, created_at: getDateNow()}), req.body.password, function(err, account) {
        if (err) {
          console.log(err);
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/mainPage');
        });
    });
});

*/


//this redirects to rigth site
function checkIfUserIdsMatch(req,res,queryParamID){
  if (req.user.id == queryParamID) {
      console.log('right user logged in')
    }
      else{
        res.redirect('/mainPage?userID='+req.user.id);
      }
}


router.get('/mainPage',passport.authenticate('jwt', { session: false}),function(req, res, next) {
  console.log(req.query.userID);
  //this redirect to rigth site.
  //checkIfUserIdsMatch(req,res,req.query.userID);
  res.render('mainPage', {user: req.user, title: 'MainPage' });
});

router.get('/match', function(req,res,next){
  res.render('newMatch', {user: req.user, title: 'Match recording' });
});

function getDateNow (){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd
  }
  if(mm<10) {
      mm='0'+mm
  }
  var returnDay = mm+'-'+dd+'-'+yyyy;
  return returnDay;
};

router.post('/match', function(req,res,next){
    var today = getDateNow();
    console.log(getDateNow());
    var newMatch =  new Match({
      name: "name of Match",
      player1: req.user.username,
      player2: req.body.opponentID,
      player1Points: req.body.Ownpoints,
      player2Points: req.body.opponentspoints,
      location: req.body.location,
      created_at: today,
      updated_at: today
    });
    console.log("newMAtch "+ newMatch);
      Match.create(newMatch, function (err) {
        console.log(err);
  });
    res.redirect('/mainPage', {message: 'new Match was saved succesfully', user: req.user, title: 'MainPage' })
});

router.get('/ownInformation', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = req.cookies['token'];
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {

          res.render('userInformation', { "username":user.username,"name":user.name,"age":user.meta.age,"hometown":user.meta.hometown, "foundUser": user});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

/*
router.get('/ownInformation', function(req, res, next){
  //here query users information
  //this also renders the userInformation view
  var foundUser = userQueries.getOneUserInformation(req,res,next)
});
*/
router.put('/ownInformation', function(req,res,next){
    console.log("put called")
    userQueries.changeUserInformation(req,res,next);
});

router.get('/matchHistory', function(req, res, next){
  //here query the matches from DB that has the userID
  matchQueries.getUsersMatches(req,res,next);
});
router.delete('/matchHistory:ID', function(req, res, next){
  //here query the matches from DB that has the userID
  colsole.log("try to delete")
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.post('/login', function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.cookie("token", token);
          res.render('mainPage', {success: true, token: 'JWT ' + token, username :req.body.username});

        } else {
          //res.redirect('/mainPage?userID='+req.user.id);

          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


router.get('/deleteMatchHistory/:ID', function(req, res, next) {
  res.render('deleteMatch', { title: 'Match deletion' });
});

router.delete('/match/:id', function(req, res, next) {
  console.log(req.params.id);
  Match.find({ _id:req.params.id }).remove().exec();
  res.send("match removed ")


});

router.get('/logout', function(req, res) {
    res.clearCookie("token");
    res.redirect('/');
});

router.post('/image', function(req, res) {
    console.log("called add image")
});



module.exports = router;
