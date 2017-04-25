var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var discGolfLane = require('../models/discGolfLane.js');
var userQueries = require('../dataBaseQueries/userQueries')
var matchQueries = require('../dataBaseQueries/matchQueries')
var discGolfHistory = require('../models/discGolfHistory.js');
const helpingFunctions = require("../javascriptFunctions/helpingFunctions")
var passport = require('passport');
var jwt  = require('jwt-simple');
var config  = require('../config/database.js'); // get db config file
var User = require('../models/user.js');
var Match = require('../models/match.js');
require('../config/passport')(passport)

router.post('/user',passport.authenticate('jwt', { session: false}), function(req, res, next) {
  userQueries.createNewUSer(req,res,next);
});
router.get('/user',passport.authenticate('jwt', { session: false}), function(req, res, next) {
  userQueries.getAllUsers(req,res,next);
});

router.post('/register', function(req, res) {
  console.log(req.body);
  if (!req.body.name || !req.body.password || !req.body.confirmPassword) {
  res.json({success: false, msg: 'Kirjoita nimi käyttäjätunnus salasana ja salasanan vahvistus.'});
}if (req.body.password != req.body.confirmPassword){
  res.json({success: false, msg: 'Salasanat eivät täsmää.'});
}

else {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    created_at: helpingFunctions.getDateNow()
  });
  // save the user
  newUser.save(function(err) {
    if (err) {
      console.log(err);
      return res.json({success: false, msg: 'Käyttäjätunnus on jo käytössä.'});
    }
    res.json({success: true, msg: 'Käyttäjätunnuksen luonti onnistui.'});
  });
}
});

router.put('/ownInformation',passport.authenticate('jwt', { session: false}), function(req,res,next){
    console.log("put called")
    var token = req.cookies["token"];
    userQueries.changeUserInformation(req,res,next,token);
});

router.get('/user/:userID',passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var userID = req.params.userID;
  req.params.userID = userID;
  userQueries.apiGetOneUserInformation(req,res,next);
});
router.get('/word', passport.authenticate('jwt', { session: false}),function(req, res, next) {
  helpingFunctions.getOneRandomWord(req,res,next);
});
router.get('/match',passport.authenticate('jwt', { session: false}), function(req, res, next) {
  matchQueries.getAllMatches(req,res,next);
});

router.get('/lane',passport.authenticate('jwt', { session: false}), function(req, res, next) {
  find("discGolfLane",{},function(err, matches) {
    res.send(matches);
  });
  return;
});

function find (collec, query, callback) {
mongoose.connection.db.collection(collec, function (err, collection) {
collection.find(query).toArray(callback);
});
}


router.get('/lane/:nameOfLane',passport.authenticate('jwt', { session: false}), function(req, res, next) {
  find("discGolfLane",{name: req.params.nameOfLane},function(err, matches) {
    res.send(matches);
  });
  return;
});

router.post('/lane/:nameOfLane',passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var date =  helpingFunctions.getDateNow()
    console.log(date);
    var username =  req.cookies['username'];
    var newHistory =  new discGolfHistory({
      description: req.body.description,
      nameOfTrack: req.params.nameOfLane,
      player1: username,
      created_at: date,
      updated_at: date,
      laneResults: []
    });
    i = 0;
    for (var key in req.body) {
        if (key == "description"){continue;}
        newHistory.laneResults[i] = req.body[key]
        i++;
      }
    console.log(newHistory);
    newHistory.save();
    res.send({success: true, message:"history saved"});
});

router.get('/UserslaneHistory/:numberOfHistories',passport.authenticate('jwt', { session: false}),function(req, res, next) {

  var query = discGolfHistory.find({player1: req.cookies['username']}).limit(parseInt(req.params.numberOfHistories));
  //console.log("query"+ query)
  query.exec(function(err, histories) {
    //console.log(histories)
    res.send(histories)
  });
});

router.get('/UserslaneHistory/:numberOfHistories/:lane',passport.authenticate('jwt', { session: false}),function(req, res, next) {
  var query = discGolfHistory.find({player1: req.cookies['username'],nameOfTrack: req.params.lane }).limit(parseInt(req.params.numberOfHistories));
  //console.log("query"+ query)
  query.exec(function(err, histories) {

    res.send(histories)
  });
});

router.get('/laneHistory/',passport.authenticate('jwt', { session: false}),function(req, res, next) {
  discGolfHistory.find({},function(err, histories) {
    res.send(histories);
  });
});
router.get('/laneHistory/:nameOfLane',passport.authenticate('jwt', { session: false}),function(req, res, next) {
  discGolfHistory.find({nameOfTrack: req.params.nameOfLane},function(err, histories) {
    res.send(histories);
  });
});

router.get('/UserslaneHistory/:nameOfLane',passport.authenticate('jwt', { session: false}),function(req, res, next) {
  discGolfHistory.find({player1: req.cookies['username'], nameOfTrack: req.params.nameOfLane},function(err, histories) {
    res.send(histories);
  });
});

router.delete('/laneHistory/:historyID',passport.authenticate('jwt', { session: false}),function(req,res,nex){
  console.log("delete history")
  discGolfHistory.findOne({_id: req.params.historyID},function(err, history){
      history.remove();
  });
});





module.exports = router;
