var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var Match = require('../models/match.js');
var userQueries = require('../dataBaseQueries/userQueries')
var matchQueries = require('../dataBaseQueries/matchQueries')
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
//this checks if user is logged in if not then redirects to
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

//this redirects to rigth site
function checkIfUserIdsMatch(req,res,queryParamID){
  if (req.user.id == queryParamID) {
      console.log('right user logged in')
    }
      else{
        res.redirect('/mainPage?userID='+req.user.id);
      }
}


router.get('/mainPage', loggedIn,function(req, res, next) {
  console.log(req.query.userID);
  //this redirect to rigth site.
  checkIfUserIdsMatch(req,res,req.query.userID);
  res.render('mainPage', {user: req.user, title: 'MainPage' });
});

router.get('/match',loggedIn, function(req,res,next){
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

router.post('/match',loggedIn, function(req,res,next){
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

router.get('/ownInformation',loggedIn, function(req, res, next){
  //here query users information
  //this also renders the userInformation view
  var foundUser = userQueries.getOneUserInformation(req,res,next)
});

router.put('/ownInformation', function(req,res,next){
    console.log("put called")
    userQueries.changeUserInformation(req,res,next);
});

router.get('/matchHistory',loggedIn, function(req, res, next){
  //here query the matches from DB that has the userID
  matchQueries.getUsersMatches(req,res,next);
});
router.delete('/matchHistory:ID',loggedIn, function(req, res, next){
  //here query the matches from DB that has the userID
  colsole.log("try to delete")
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.post('/login', passport.authenticate('local'), function(req, res, next) {
  res.redirect('/mainPage?userID='+req.user.id);
});

router.get('/deleteMatchHistory/:ID',loggedIn, function(req, res, next) {
  res.render('deleteMatch', { title: 'Match deletion' });
});

router.delete('/match/:id',loggedIn, function(req, res, next) {
  console.log(req.params.id);
  Match.find({ _id:req.params.id }).remove().exec();
  res.send("match removed ")


});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
